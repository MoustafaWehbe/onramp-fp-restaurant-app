import { verificationEmailHandler } from "../handlers/verification-email.handler";
import { passwordResetEmailHandler } from "../handlers/password-reset-email.handler";
import { restaurantClaimRejectedEmailHandler } from "../handlers/restaurant-claim-rejected-email.handler";
import { restaurantClaimApprovedEmailHandler } from "../handlers/restaurant-claim-approved-email.handler";

export const emailHandlerRegistry = new Map([
    [
        "verification",
        verificationEmailHandler,
    ],
    [
        "password-reset",
        passwordResetEmailHandler,
    ],
    [
        "restaurant-claim-rejected",
        restaurantClaimRejectedEmailHandler,
    ],
    [
        "restaurant-claim-approved",
        restaurantClaimApprovedEmailHandler,
    ],
]);