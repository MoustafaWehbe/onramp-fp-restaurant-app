import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const FROM_ADDRESS = process.env.SMTP_FROM ?? "no-reply@example.com";
const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export async function sendVerificationEmail(
    to: string,
    rawToken: string,
): Promise<void> {
    const verifyUrl = `${APP_URL}/verify-email?token=${rawToken}`;

    await transporter.sendMail({
        from: FROM_ADDRESS,
        to,
        subject: "Verify your email address",
        html: `
            <p>Thanks for signing up. Click the link below to verify your email address:</p>
            <p><a href="${verifyUrl}">${verifyUrl}</a></p>
            <p>This link expires in 1 hour. If you didn't create an account, you can ignore this email.</p>
        `,
    });
}