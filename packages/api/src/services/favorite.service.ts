import { Restaurant } from "../models/Restaurant";
import { Favorite } from "../models/Favorite";
import { createError } from "src/middleware/error-handler";

export const favoriteService = {
  create: async (userId: string, restaurantSlug: string) => {
    const restaurant = await Restaurant.findOne({
      where: {
        slug: restaurantSlug,
      },
      attributes:["id"],
    });

    if (!restaurant) {
      throw createError("Restaurant not found", 404);
    }

    const restaurantId = restaurant.id;

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

  delete: async (userId: string, restaurantSlug: string) => {

    const restaurant = await Restaurant.findOne({
      where: {
        slug: restaurantSlug,
      },
      attributes: ["id"],
    });

    if(!restaurant) {
      throw createError("Restaurant not found", 404);
    }

    const restaurantId = restaurant.id;

    const deleted = await Favorite.destroy({
      where: {
        userId,
        restaurantId,
      },
    });

    if (!deleted) {
      throw createError(
        "Restaurant not found",
        404,
      );
    }
  },

  getFavorites: async (userId: string) => {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: [
            "id",
            "slug",
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

    return favorites.map(favorite => favorite.restaurant);
  },
}
