import { Restaurant } from "../models/Restaurant";
import { Branch } from "../models/Branch";
import { Review } from "../models/Review";
import { User } from "../models/User";
import { Menu } from "../models/Menu";
import { createError } from "src/middleware/error-handler";
import { type Includeable, Op, literal, type WhereOptions } from "sequelize";
import { Favorite } from "../models/Favorite";

interface GetRestaurantsOptions {
  page: number,
  limit: number,
  userId?: string,
}

interface SearchRestaurantsOptions {
  search: string,
  city?: string | null,
  cuisine?: string | null,
  priceRange?: string | null,
  page: number,
  limit: number,
  userId?: string,
}

export const restaurantService = {
  getRestaurantBySlug: async (slug: string,  userId?: string) => {
    const restaurant = await Restaurant.findOne({
      where: {
        slug,
      },
      attributes: [
        "id",
        "name",
        "slug",
        "description",
        "price_range",
        "ambiance_tags",
        "cuisine_type",
        "email",
        "phone",
        "review_count",
        "average_rating",
        "image_url",
      ],
      include: [
        {
          model: Branch,
          as: "branches",
          attributes: [
            "id",
            "restaurantId",
            "name",
            "slug",
            "city",
            "address",
            "phone",
            "opening_hours",
            "review_count",
            "average_rating",
          ],
          include: [
            {
              model: Review,
              as: "reviews",
              separate: true,
              limit: 5,
              order: [["created_at", "DESC"]],
              attributes: [
                "id",
                "userId",
                "branchId",
                "rating",
                "comment",
                "createdAt",
              ],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: [
                    "id",
                    "name",
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Menu,
          as: "menus",
          attributes: [
            "id",
            "name",
            "description",
          ],
        },
      ],
    });

    if (!restaurant) {
      throw createError("Restaurant not found", 404);
    }

    const favoriteIds = await getFavorites(userId);

    return serializeRestaurant(restaurant, favoriteIds.has(restaurant.id));
  },

  getRestaurants: async({userId, page,limit}: GetRestaurantsOptions) => {

    const offset = (page - 1) * limit;

    const { rows, count } = await Restaurant.findAndCountAll({
      attributes: [
        "id",
        "name",
        "slug",
        "description",
        "price_range",
        "cuisine_type",
        "review_count",
        "average_rating",
        "image_url",
        "createdAt",
      ],
      limit,
      offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
    });

    const favoriteIds = await getFavorites(userId);


    return {
      data: rows.map((restaurant) => serializeRestaurant(restaurant, favoriteIds.has(restaurant.id))),
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  searchRestaurants: async ({
    search,
    cuisine,
    city,
    priceRange,
    page,
    limit,
    userId,
  }: SearchRestaurantsOptions) => {
    const include: Includeable[] = [];

    const query = search.trim();

    const where: WhereOptions = {
      ...(query && {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${query}%`,
            },
          },
        ],
      }),

      ...(cuisine && {
        cuisine_type: {
          [Op.iLike]: `%${cuisine}%`
        },
      }),

      ...(priceRange && {
        price_range: {
          [Op.iLike]: `%${priceRange}%`
        },
      }),
    };

    if (city) {
      include.push({
        model: Branch,
        as: "branches",
        where: {
          city: {
            [Op.iLike]: `%${city}%`,
          },
        },
        attributes: [],
        required: true,
      });
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Restaurant.findAndCountAll({
      where,
      include,
      attributes: [
        "id",
        "slug",
        "name",
        "description",
        "price_range",
        "cuisine_type",
        "review_count",
        "average_rating",
        "image_url",
        "createdAt",
      ],
      limit,
      offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
    });

    const favoritIds = await getFavorites(userId);

    return {
      data: rows.map((restaurant) => serializeRestaurant(restaurant, favoritIds.has(restaurant.id))),
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  },
  searchRestaurantsByName: async (name: string) => {
    const searchTerm = name.trim();

    const prefixPattern = `${searchTerm
      .replace(/\\/g, "\\\\")
      .replace(/%/g, "\\%")
      .replace(/_/g, "\\_")}%`;

    const escapedPrefixPattern =
      Restaurant.sequelize!.escape(prefixPattern);

    return Restaurant.findAll({
      where: {
        name: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },

      attributes: ["id", "name", "slug"],

      order: [
        [
          literal(`
          CASE
            WHEN "Restaurant"."name" ILIKE ${escapedPrefixPattern} ESCAPE '\\'
            THEN 0
            ELSE 1
          END
        `),
          "ASC",
        ],
        ["name", "ASC"],
      ],

      limit: 10,
    });
  },
};

//helper function to get the favorite restaurant ids for the logged in user

const getFavorites = async (userId?: string): Promise<Set<string>> => {
  if(!userId) {
    return new Set();
  }
  const favorites = await Favorite.findAll({
    where: {
      userId,
    },
    attributes: ["restaurantId"],
    raw: true,
  });

  return new Set(
    favorites.map((favorite) => favorite.restaurantId)
  );
};

//helper function to normalize the values of average_rating and review_count to numbers

const serializeRestaurant = (restaurant: Restaurant, isFavorite = false) => {
  const data = restaurant.toJSON();

  return {
    ...data,
    average_rating: Number(data.average_rating),
    review_count: Number(data.review_count),
    is_favorite: isFavorite,
  };
};