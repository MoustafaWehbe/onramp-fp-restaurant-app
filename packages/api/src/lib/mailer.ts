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

const fromAddress = process.env.SMTP_FROM ?? "no-reply@example.com";
const appUrl = process.env.APP_URL ?? "http://localhost:3000";

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
    from: fromAddress,
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(
  to: string,
  rawToken: string,
): Promise<void> {
  const verifyUrl = `${appUrl}/verify-email?token=${rawToken}`;

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
  const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

 const html = await renderPasswordResetEmail(resetUrl);

  await sendEmail({
    to,
    subject: "Reset your password",
    html,
  });
}