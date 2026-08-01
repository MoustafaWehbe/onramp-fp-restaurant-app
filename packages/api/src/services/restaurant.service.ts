import { Restaurant } from "../models/Restaurant";
import { Branch } from "../models/Branch";
import { Review } from "../models/Review";
import { User } from "../models/User";
import { Menu } from "../models/Menu";

export const getRestaurantById = async (id: string) => {
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
    ],
    include: [
      {
        model: Branch,
        as: "branches",
        attributes: [
          "id",
          "name",
          "city",
          "address",
          "phone",
          "opening_hours",
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
        ],
      },
    ],
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return restaurant;
};