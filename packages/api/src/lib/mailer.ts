import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
if (!host) {
    throw new Error("SMTP_HOST is not configured");
}

const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
     connectionTimeout: 10_000,
     greetingTimeout: 10_000,
     socketTimeout: 15_000,
});


export async function sendVerificationEmail(
    to: string,
    rawToken: string,
): Promise<void> {
    const fromAddress = process.env.SMTP_FROM ?? "no-reply@example.com";
    const appUrl = process.env.APP_URL ?? "http://localhost:3000";
    const verifyUrl = `${appUrl}/verify-email?token=${rawToken}`;

    await transporter.sendMail({
        from: fromAddress,
        to,
        subject: "Verify your email address",
        html: `
            <p>Thanks for signing up. Click the link below to verify your email address:</p>
            <p><a href="${verifyUrl}">${verifyUrl}</a></p>
            <p>This link expires in 1 hour. If you didn't create an account, you can ignore this email.</p>
        `,
    });
}

export async function sendPasswordResetEmail(
  to: string,
  rawToken: string,
): Promise<void> {
  const fromAddress = process.env.SMTP_FROM ?? "no-reply@example.com";
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject: "Reset your password",
    html: `
      <p>We received a request to reset your password.</p>
      <p>Click the link below to choose a new password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `,
  });
}