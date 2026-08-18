import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

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

const isDevelopment = process.env.NODE_ENV === "development";

const fromAddress =
  process.env.SMTP_FROM ??
  (isDevelopment ? "no-reply@example.com" : undefined);

if (!fromAddress) {
  throw new Error("SMTP_FROM is not configured");
}


interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  send: async ({
    to,
    subject,
    html,
  }: SendEmailPayload): Promise<void> => {
    await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
    });
  },
};