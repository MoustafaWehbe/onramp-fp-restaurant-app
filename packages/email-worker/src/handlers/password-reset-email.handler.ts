import type { EmailHandler } from "../types/email-handler.types";
import { emailService } from "../services/email.service";
import { PasswordResetEmail } from "../templates/password-reset-email";
import { render } from "@react-email/render";


export const passwordResetEmailHandler: EmailHandler = {

  async handle(data: any) {

    const html = await render(
        PasswordResetEmail({
            resetUrl: data.resetUrl,
        })
    );


    await emailService.send({
      to: data.to,
      subject: "Reset your password",
      html,
    });
  },
};