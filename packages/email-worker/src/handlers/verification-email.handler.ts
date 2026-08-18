import { EmailHandler } from "../types/email-handler.types";
import { VerificationEmail } from "../templates/verification-email.template";
import { emailService } from "../services/email.service";
import { render } from "@react-email/render";

export const verificationEmailHandler:EmailHandler = {
    handle: async(data: any) => {
        const html = await render(
            VerificationEmail({
                verifyUrl: data.variables.verificationUrl,
            })
        );

        await emailService.send({
            to: data.to,
            subject: "Verify your email",
            html,
        })  
    }
} 