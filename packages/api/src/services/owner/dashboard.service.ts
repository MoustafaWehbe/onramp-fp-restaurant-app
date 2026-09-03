import { Branch, Menu, Restaurant } from "@fp_restaurant/shared";
import { createError } from "../../middleware/error-handler";

export const dashboardService = {
  get: async (restaurantSlug: string) => {
    const restaurant = await Restaurant.findOne({
      where: { slug: restaurantSlug },
    });

    if (!restaurant) {
      throw createError("Restaurant not found", 404);
    }

    const [branchCount, menuCount] = await Promise.all([
      Branch.count({
        where: {
          restaurantId: restaurant.id,
        },
      }),

      Menu.count({
        where: {
          restaurantId: restaurant.id,
          is_active: true,
        },
      }),
    ]);

    return {
      branch_count: branchCount,
      menu_count: menuCount,
      review_count: restaurant.review_count,
      average_rating: restaurant.average_rating,
    };
  },
};