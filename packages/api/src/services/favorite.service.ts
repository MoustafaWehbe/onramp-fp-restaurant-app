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
            "average_rating",
            "review_count",
            "image_url",
          ]
        }
      ]
    });

    return favorites
      .map((favorite) => favorite.restaurant)
      .filter((restaurant): restaurant is Restaurant => restaurant !== undefined)
      .map(serializeRestaurant);
  },
}

//helper function to normalize the values of average_rating and review_count to numbers

const serializeRestaurant = (restaurant: Restaurant) => {
  const data = restaurant.toJSON();

  return {
    ...data,
    average_rating: Number(data.average_rating),
    review_count: Number(data.review_count),
  }
}