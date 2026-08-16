import { Restaurant } from "../../models/Restaurant";
import { RestaurantClaim } from "../../models/RestaurantClaim";
import { createError } from "src/middleware/error-handler";
import { Op } from "sequelize";

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

    // A user can only have one restaurant claim,
    // whether it is for an existing or a new restaurant.
    const existingClaim = await RestaurantClaim.findOne({
      where: {
        userId,
      },
    });

    if (existingClaim) {
      throw createError(
        "You can only claim one restaurant",
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

  getMyClaim: async (userId: string) => {
    const claim = await RestaurantClaim.findOne({
      where: {
        userId,
        status: {
          [Op.in]: ["approved", "completed"],
        },
      },
    });

    if (!claim) {
      throw createError(
        "No approved restaurant claim found",
        404,
      );
    }

    let restaurantName: string | null = null;
    let restaurantSlug: string | null = null;

    if (claim.restaurantId) {
      const restaurant = await Restaurant.findByPk(
        claim.restaurantId,
        {
          attributes: ["id", "slug", "name"],
        },
      );

      if (restaurant) {
        restaurantName = restaurant.name;
        restaurantSlug = restaurant.slug;
      }
    }

    return {
      ...claim.toJSON(),
      restaurantName,
      restaurantSlug,
    };
  },
};