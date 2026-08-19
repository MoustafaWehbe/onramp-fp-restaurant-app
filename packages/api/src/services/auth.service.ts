import crypto from "crypto";
import bcrypt from "bcrypt";
import {
  hashPassword,
  verifyPassword,
  generateTokenPair,
  verifyRefreshToken,
  EmailVerificationToken,
  PasswordResetToken,
} from "@fp_restaurant/shared";
import { User, Session, RefreshToken } from "../models";
import { createError } from "../middleware/error-handler";
import { UniqueConstraintError } from "sequelize";
import { getSequelize } from "@fp_restaurant/shared";
import { emailQueue } from "@fp_restaurant/shared";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
}

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await User.findOne({ where: { email: input.email } });
    if (existing) {
      throw createError("Email already in use", 409);
    }

    const passwordHash = await hashPassword(input.password);
    const user = await User.create({
      email: input.email,
      passwordHash,
      name: input.name,
    });

    await this.requestEmailVerification(user.id);

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async login(input: LoginInput) {
    const user = await User.findOne({ where: { email: input.email } });
    if (!user) {
      throw createError("Invalid credentials", 401);
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw createError("Invalid credentials", 401);
    }

    if (!user.emailVerified) {
      throw createError("Please verify your email before logging in", 403);
    }

    const session = await Session.create({
      userId: user.id,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1_000), // 7 days
    });

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    });

    const tokenHash = crypto
      .createHash("sha256")
      .update(tokens.refreshToken)
      .digest("hex");

    await RefreshToken.create({
      userId: user.id,
      sessionId: session.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1_000),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refresh(rawToken: string) {
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const stored = await RefreshToken.findOne({ where: { tokenHash } });
    if (!stored || !stored.isValid) {
      throw createError("Invalid or expired refresh token", 401);
    }

    const payload = verifyRefreshToken(rawToken);
    const user = await User.findByPk(payload.userId);
    if (!user) throw createError("User not found", 404);

    // Rotate token
    await stored.update({ revokedAt: new Date() });

    const session = await Session.findByPk(stored.sessionId);
    if (!session) throw createError("Session not found", 401);

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    });

    const newHash = crypto
      .createHash("sha256")
      .update(tokens.refreshToken)
      .digest("hex");
    await RefreshToken.create({
      userId: user.id,
      sessionId: session.id,
      tokenHash: newHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1_000),
    });

    return tokens;
  }

  async logout(sessionId: string) {
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { sessionId } },
    );
    await Session.destroy({ where: { id: sessionId } });
  }

  async getProfile(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "name", "role", "emailVerified", "createdAt"],
    });
    if (!user) throw createError("User not found", 404);
    return user;
  }

  async requestEmailVerification(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) throw createError("User not found", 404);
    if (user.emailVerified) throw createError("Email already verified", 409);

    await EmailVerificationToken.destroy({ where: { userId } });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    await EmailVerificationToken.create({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1_000),
    });

    await emailQueue.add("email", {
      type: "verification",
      to: user.email,
      variables: {
        verificationUrl: `${process.env.APP_URL}/verify-email?token=${rawToken}`,
      },
    });

    return { message: "Verification email queued" }
  }

  async resendVerification(email: string) {
    const user = await User.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!user) {
      return {
        message:
          "If an account exists for this email, a verification email has been sent.",
      };
    }

    if (user.emailVerified) {
      throw createError("Email already verified", 409);
    }

    return this.requestEmailVerification(user.id);
  }

  async verifyEmail(rawToken: string) {
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const tokenStored = await EmailVerificationToken.findOne({ where: { tokenHash } });

    if (!tokenStored || tokenStored.isExpired) {
      throw createError("Invalid or expired verification token", 400);
    }

    const user = await User.findByPk(tokenStored.userId);
    if (!user) throw createError("User not found", 404);

    await user.update({ emailVerified: true });
    await tokenStored.destroy();

    return { message: "Email verified successfully" };
  }

  async requestPasswordReset(email: string) {
    const genericMessage =
      "If an account exists for this email, a password reset link has been sent.";

    const user = await User.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    // Don't reveal whether the email exists
    if (!user) {
      return { message: genericMessage };
    }

    // Remove any previous reset token
    await PasswordResetToken.destroy({
      where: {
        userId: user.id,
      },
    });

    // Generate a secure token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Store only its hash
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    let resetToken;

    try {
      resetToken = await PasswordResetToken.create({
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return { message: genericMessage };
      }

      throw error;
    }

    try {
      await emailQueue.add("email", {
        type: "password-reset",
        to: user.email,
        variables: {
          resetUrl:
            `${process.env.APP_URL}/reset-password?token=${rawToken}`,
        },
      });
    } catch (err) {
      await resetToken.destroy();
      console.error("Failed to enqueue password reset email:", err);
    }

    return {
      message: genericMessage,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const sequelize = getSequelize();
    const transaction = await sequelize.transaction();

    try {
      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const resetToken = await PasswordResetToken.findOne({
        where: {
          tokenHash,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!resetToken) {
        throw new Error("Invalid or expired reset token");
      }

      if (!resetToken.isValid) {
        await resetToken.destroy({
          transaction,
        });

        throw new Error("Reset token has expired");
      }

      const user = await User.findByPk(resetToken.userId, {
        transaction,
      });

      if (!user) {
        throw new Error("User not found");
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);

      user.passwordHash = passwordHash;

      await user.save({
        transaction,
      });

      // Revoke active refresh tokens after password reset
      await RefreshToken.destroy({
        where: {
          userId: user.id,
        },
        transaction,
      });

      // Terminate active sessions after password reset
      await Session.destroy({
        where: {
          userId: user.id,
        },
        transaction,
      });

      // Consume reset token
      await resetToken.destroy({
        transaction,
      });

      await transaction.commit();

      return {
        message: "Password reset successfully",
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}


export const authService = new AuthService();
