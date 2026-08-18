import { verificationEmailHandler } from "../handlers/verification-email.handler";
import { passwordResetEmailHandler } from "../handlers/password-reset-email.handler";

export const emailHandlerRegistry = new Map([
    [
        "verification",
        verificationEmailHandler,
    ],
    [
        "password-reset",
        passwordResetEmailHandler,
    ]
]);