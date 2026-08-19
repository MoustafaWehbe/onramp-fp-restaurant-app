import { NotificationEmailLayout } from "./notification-email-layout";

interface RestaurantClaimRejectedEmailProps {
  restaurantName: string;
}

export function RestaurantClaimRejectedEmail({
  restaurantName,
}: RestaurantClaimRejectedEmailProps) {
  return (
    <NotificationEmailLayout
      preview="Your Platera restaurant claim was rejected"
      title="Restaurant claim rejected"
      description={`We’re sorry to inform you that your claim for ${restaurantName} has been rejected.`}
    />
  );
}