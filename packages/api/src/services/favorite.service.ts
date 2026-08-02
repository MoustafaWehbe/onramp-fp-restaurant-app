import { Restaurant } from "../models/Restaurant";
import { Favorite } from "../models/Favorite";
import { createError } from "src/middleware/error-handler";

export const favoriteService = {
  create: async (userId: string, restaurantId: string) => {
    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      throw createError("This restaurant does not exist", 404);
    }

    const existingFavorite = await Favorite.findOne({
      where: { userId, restaurantId },
    });

    if (existingFavorite) {
      throw createError(
        "This restaurant already exists in your favorites list",
        409,
      );
    }

    return Favorite.create({
      userId,
      restaurantId,
    });
  },

  delete: async (userId: string, restaurantId: string) => {
    const deleted = await Favorite.destroy({
      where: {
        userId,
        restaurantId,
      },
    });

    if (!deleted) {
      throw createError(
        "This restaurant does not exist in your favorites list",
        404,
      );
    }
  },

  getFavorites: async (userId: string) => {
    return Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: [
            "id",
            "name",
            "description",
            "cuisine_type",
            "price_range",
            "email",
            "phone",
            "ambiance_tags",
          ]
        }
      ]
    });
  },
}
