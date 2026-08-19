import { AuthEmailLayout } from "./auth-email-layout";

interface VerificationEmailProps {
  verifyUrl: string;
}

export function VerificationEmail({
  verifyUrl,
}: VerificationEmailProps) {
  return (
    <AuthEmailLayout
      preview="Verify your Platera account"
      title="Verify your email"
      description={
        "Thanks for creating an account. Please verify your email address to activate your account."
      }
      buttonText="Verify Email"
      buttonUrl={verifyUrl}
    />
  );
}