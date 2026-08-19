import { render } from "@react-email/render";
import type { EmailHandler } from "../types/email-handler.types";
import { emailService } from "../services/email.service";
import { RestaurantClaimRejectedEmail } from "../templates/restaurant-claim-rejected-email";

export const restaurantClaimRejectedEmailHandler: EmailHandler = {
  async handle(data) {
    const html = await render(
      RestaurantClaimRejectedEmail({
        restaurantName: data.variables?.restaurantName ?? "your restaurant",
      }),
    );

    await emailService.send({
      to: data.to,
      subject: "Your restaurant claim was rejected",
      html,
    });
  },
};