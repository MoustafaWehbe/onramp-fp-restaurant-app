import { EmailLayout } from "./EmailLayout";

interface PasswordResetEmailProps {
  resetUrl: string;
}

export function PasswordResetEmail({
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <EmailLayout
      preview="Reset your Platera password"
      title="Reset your password"
      description={
        "We received a request to reset your password. Click the button below to choose a new password."
      }
      buttonText="Reset Password"
      buttonUrl={resetUrl}
    />
  );
}