import { render } from "@react-email/render";

import { VerificationEmail } from "./VerificationEmail";
import { PasswordResetEmail } from "./PasswordResetEmail";


export function renderVerificationEmail(
  verifyUrl: string,
) {
  return render(
    <VerificationEmail verifyUrl={verifyUrl} />
  );
}


export function renderPasswordResetEmail(
  resetUrl: string,
) {
  return render(
    <PasswordResetEmail resetUrl={resetUrl} />
  );
}