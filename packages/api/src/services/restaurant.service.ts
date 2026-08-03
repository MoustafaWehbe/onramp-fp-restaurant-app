import { Restaurant } from "../models/Restaurant";
import { Branch } from "../models/Branch";
import { Review } from "../models/Review";
import { User } from "../models/User";
import { Menu } from "../models/Menu";

export const restaurantService = {
  getRestaurantById: async (id: string) => {
    const restaurant = await Restaurant.findByPk(id, {
      attributes: [
        "id",
        "name",
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
      throw new Error("Restaurant not found");
    }

    return restaurant;
  },
};