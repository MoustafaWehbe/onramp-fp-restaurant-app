import { render } from "@react-email/render";
import type { EmailHandler } from "../types/email-handler.types";
import { emailService } from "../services/email.service";
import { RestaurantClaimApprovedEmail } from "../templates/restaurant-claim-approved-email";

export const restaurantClaimApprovedEmailHandler: EmailHandler = {
  async handle(data) {
    const html = await render(
      RestaurantClaimApprovedEmail({
        restaurantName:
          data.variables?.restaurantName ?? "your restaurant",
      }),
    );

    await emailService.send({
      to: data.to,
      subject: "Your restaurant claim has been approved",
      html,
    });
  },
};