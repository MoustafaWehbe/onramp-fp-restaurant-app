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
