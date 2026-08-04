import { Restaurant } from "../models/Restaurant";
import { Branch } from "../models/Branch";
import { Review } from "../models/Review";
import { User } from "../models/User";
import { Menu } from "../models/Menu";
import { createError } from "src/middleware/error-handler";
import { type Includeable, Op, type WhereOptions } from "sequelize";

interface GetRestaurantsOptions {
  search?: string,
  cuisine?: string,
  city?: string,
  page: number,
  limit: number,
}

export const restaurantService = {
  getRestaurantBySlug: async (slug: string) => {
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

    return restaurant;
  },

  getRestaurants: async({
    search,
    cuisine,
    city,
    page,
    limit,
  }: GetRestaurantsOptions) => {
    const include: Includeable[] = [];

    const where: WhereOptions = {
      ...(search && {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      }),

      ...(cuisine && {
        cuisine_type: cuisine,
      }),
    };

    if(city) {
      include.push({
        model: Branch,
        as: "branches",
        where: {
          city: {
            [Op.iLike]: city,
          }
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
        "name",
        "slug",
        "description",
        "price_range",
        "cuisine_type",
        "review_count",
        "average_rating",
        "createdAt",
      ],
      limit,
      offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows,
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
};