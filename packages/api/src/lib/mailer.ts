import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import {
  renderVerificationEmail,
  renderPasswordResetEmail,
} from "../emails/renderEmail";

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

const isDevelopment = process.env.NODE_ENV === "development";

const fromAddress = process.env.SMTP_FROM;
if (!fromAddress && !isDevelopment) {
  throw new Error("SMTP_FROM is not configured");
}

const appUrl = process.env.APP_URL;
if (!appUrl && !isDevelopment) {
  throw new Error("APP_URL is not configured");
}

const resolvedFromAddress = fromAddress ?? "no-reply@example.com";
const resolvedAppUrl = appUrl ?? "http://localhost:3000";

const parsedAppUrl = new URL(resolvedAppUrl);
const isLocalhost =
  parsedAppUrl.hostname === "localhost" ||
  parsedAppUrl.hostname === "127.0.0.1";

if (isDevelopment) {
  if (!isLocalhost) {
    throw new Error(
      "APP_URL must point to localhost or 127.0.0.1 in development",
    );
  }
} else {
  if (parsedAppUrl.protocol !== "https:") {
    throw new Error("APP_URL must use HTTPS outside development");
  }

  if (isLocalhost) {
    throw new Error("APP_URL cannot use localhost outside development");
  }
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  await transporter.sendMail({
    from: resolvedFromAddress,
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(
  to: string,
  rawToken: string,
): Promise<void> {
  const verifyUrl = `${resolvedAppUrl}/verify-email?token=${rawToken}`;

  const html = await renderVerificationEmail(verifyUrl);

  await sendEmail({
    to,
    subject: "Verify your email",
    html,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  rawToken: string,
): Promise<void> {
  const resetUrl = `${resolvedAppUrl}/reset-password?token=${rawToken}`;

 const html = await renderPasswordResetEmail(resetUrl);

  await sendEmail({
    to,
    subject: "Reset your password",
    html,
  });
}