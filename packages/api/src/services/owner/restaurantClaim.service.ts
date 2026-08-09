import { Restaurant } from "../../models/Restaurant";
import { RestaurantClaim } from "../../models/RestaurantClaim";
import { createError } from "src/middleware/error-handler";

export const restaurantClaimService = {
  create: async (
    userId: string,
    restaurantId: string | null,
    restaurantName: string,
    email: string,
    phone: string
  ) => {
    // If an existing restaurant was selected, verify that it exists
    if (restaurantId) {
      const restaurant = await Restaurant.findByPk(restaurantId);

      if (!restaurant) {
        throw createError("Restaurant not found", 404);
      }
    }

    // Check if the user already has an approved restaurant
    const approvedClaim = await RestaurantClaim.findOne({
      where: {
        userId,
        status: "approved",
      },
    });

    if (approvedClaim) {
      throw createError(
        "You already have an approved restaurant ownership claim",
        409
      );
    }

    // Check for an existing pending claim
    const pendingClaim = await RestaurantClaim.findOne({
      where: {
        userId,
        restaurantId,
        status: "pending",
      },
    });

    if (pendingClaim) {
      throw createError(
        "You already have a pending claim for this restaurant",
        409
      );
    }

    const claim = await RestaurantClaim.create({
      userId,
      restaurantId,
      restaurantName,
      email,
      phone,
      status: "pending",
    });

    return claim;
  },
};