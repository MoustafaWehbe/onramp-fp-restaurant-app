import request from "supertest";
import { app } from "../../app";

// Mock the database so tests do not require a real database
jest.mock("../../src/lib/db", () => ({
  initializeDatabase: jest.fn().mockResolvedValue(undefined),
  getDatabase: jest.fn(),
}));

// Mock the authentication service
jest.mock("../../src/services/auth.service", () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
    verifyEmail: jest.fn(),
    requestPasswordReset: jest.fn(),
  },
}));

import { authService } from "../../src/services/auth.service";

const mockAuthService = authService as jest.Mocked<typeof authService>;

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── POST /api/auth/register ─────────────────────────────────────────────────

describe("POST /api/auth/register", () => {
  it("returns 201 with user data on success", async () => {
    mockAuthService.register.mockResolvedValue({
      id: "uuid-1",
      email: "alice@example.com",
      name: "Alice",
      role: "user",
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "alice@example.com",
      password: "SecurePass1",
      name: "Alice",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe("alice@example.com");

    expect(mockAuthService.register).toHaveBeenCalledWith({
      email: "alice@example.com",
      password: "SecurePass1",
      name: "Alice",
    });
  });

  it("returns 422 when email is invalid", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "not-an-email",
      password: "SecurePass1",
      name: "Alice",
    });

    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe("email");
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it("returns 422 when password is too weak", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "alice@example.com",
      password: "short",
      name: "Alice",
    });

    expect(res.status).toBe(422);
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────

describe("POST /api/auth/login", () => {
  it("returns 200 with user data and authentication cookies", async () => {
    mockAuthService.login.mockResolvedValue({
      user: {
        id: "uuid-1",
        email: "alice@example.com",
        name: "Alice",
        role: "user",
      },
      accessToken: "access.token.here",
      refreshToken: "refresh.token.here",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "alice@example.com",
      password: "SecurePass1",
    });

    expect(res.status).toBe(200);

    expect(res.body.data.user).toEqual({
      id: "uuid-1",
      email: "alice@example.com",
      name: "Alice",
      role: "user",
    });

    // Tokens are stored in cookies instead of being returned in the body
    expect(res.headers["set-cookie"]).toBeDefined();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: "alice@example.com",
      password: "SecurePass1",
      ipAddress: expect.any(String),
      userAgent: undefined,
    });
  });

  it("returns 422 when body is missing", async () => {
    const res = await request(app).post("/api/auth/login").send({});

    expect(res.status).toBe(422);
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });
});

// ─── POST /api/auth/verify-email ─────────────────────────────────────────────

describe("POST /api/auth/verify-email", () => {
  it("returns 200 when email verification succeeds", async () => {
    mockAuthService.verifyEmail.mockResolvedValue({
      message: "Email verified successfully",
    });

    const res = await request(app).post("/api/auth/verify-email").send({
      token: "valid-verification-token",
    });

    expect(res.status).toBe(200);

    expect(res.body.data.message).toBe(
      "Email verified successfully",
    );

    expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(
      "valid-verification-token",
    );
  });

  it("returns 500 when the service throws a normal error", async () => {
    mockAuthService.verifyEmail.mockRejectedValue(
      new Error("Invalid or expired verification token"),
    );

    const res = await request(app).post("/api/auth/verify-email").send({
      token: "invalid-token",
    });

    expect(res.status).toBe(500);
  });

  it("returns 422 when token is missing", async () => {
    const res = await request(app)
      .post("/api/auth/verify-email")
      .send({});

    expect(res.status).toBe(422);
    expect(mockAuthService.verifyEmail).not.toHaveBeenCalled();
  });
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────

describe("POST /api/auth/forgot-password", () => {
  const successMessage =
    "If an account with that email exists, a password reset link has been sent.";

  it("returns 200 when the password reset request succeeds", async () => {
    mockAuthService.requestPasswordReset.mockResolvedValue({
      message: successMessage,
    });

    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({
        email: "alice@example.com",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(successMessage);
    
    expect(
      mockAuthService.requestPasswordReset,
    ).toHaveBeenCalledWith("alice@example.com");

    expect(
      mockAuthService.requestPasswordReset,
    ).toHaveBeenCalledTimes(1);
  });

  it("returns 422 when the email is invalid", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({
        email: "not-an-email",
      });

    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe("email");

    expect(
      mockAuthService.requestPasswordReset,
    ).not.toHaveBeenCalled();
  });

  it("returns 422 when the email is missing", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({});

    expect(res.status).toBe(422);

    expect(
      mockAuthService.requestPasswordReset,
    ).not.toHaveBeenCalled();
  });

  it("returns the same success response for an unknown email", async () => {
    mockAuthService.requestPasswordReset.mockResolvedValue({
      message: successMessage,
    });

    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({
        email: "unknown@example.com",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(successMessage);

    expect(
      mockAuthService.requestPasswordReset,
    ).toHaveBeenCalledWith("unknown@example.com");
  });
});