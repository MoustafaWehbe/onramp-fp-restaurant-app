import { NotificationEmailLayout } from "./notification-email-layout";

interface RestaurantClaimApprovedEmailProps {
  restaurantName: string;
}

export function RestaurantClaimApprovedEmail({
  restaurantName,
}: RestaurantClaimApprovedEmailProps) {
  return (
    <NotificationEmailLayout
      preview="Your Platera restaurant claim has been approved"
      title="Restaurant claim approved"
      description={`Great news! Your claim for ${restaurantName} has been approved. You are now a restaurant owner on Platera. You can log in using the same email address and password you used when submitting your claim to access your dashboard.`}
    />
  );
}