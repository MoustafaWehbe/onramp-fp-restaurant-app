"use strict";

const { QueryTypes } = require("sequelize");
const { faker } = require("@faker-js/faker");

const claimIds = [
  "00000000-0000-0000-0000-000000000001",
  "00000000-0000-0000-0000-000000000002",
  "00000000-0000-0000-0000-000000000003",
  "00000000-0000-0000-0000-000000000004",
  "00000000-0000-0000-0000-000000000005",
  "00000000-0000-0000-0000-000000000006",
  "00000000-0000-0000-0000-000000000007",
  "00000000-0000-0000-0000-000000000008",
  "00000000-0000-0000-0000-000000000009",
  "00000000-0000-0000-0000-000000000010",
];

module.exports = {
  async up(queryInterface) {
    const restaurants = await queryInterface.sequelize.query(
      "SELECT id, name, email, phone FROM restaurants",
      {
        type: QueryTypes.SELECT,
      },
    );

    const users = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'owner'",
      {
        type: QueryTypes.SELECT,
      },
    );

    if (!users.length) {
      throw new Error(
        "Cannot seed restaurant claims: no owners found.",
      );
    }

    const claims = [];

    const approvedUserIds = new Set();
    const approvedRestaurantIds = new Set();

    for (let i = 0; i < 10; i++) {
      const restaurant =
        i < 7 && restaurants.length
          ? restaurants[i % restaurants.length]
          : null;

      const userId = users[i % users.length].id;
      const restaurantId = restaurant?.id ?? null;

      let status = "pending";

      // Approve only existing restaurants where
      // neither the owner nor restaurant already has
      // an approved claim.
      if (
        restaurantId &&
        !approvedUserIds.has(userId) &&
        !approvedRestaurantIds.has(restaurantId)
      ) {
        status = "approved";

        approvedUserIds.add(userId);
        approvedRestaurantIds.add(restaurantId);
      } else if (i % 3 === 0) {
        status = "rejected";
      }

      claims.push({
        id: claimIds[i],

        restaurant_id: restaurantId,

        user_id: userId,

        restaurant_name:
          restaurant?.name ??
          faker.company.name(),

        email:
          restaurant?.email ??
          faker.internet.email(),

        phone:
          restaurant?.phone ??
          faker.phone.number(),

        status,

        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("restaurant_claims", claims);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("restaurant_claims", {
      id: {
        [Sequelize.Op.in]: claimIds,
      },
    });
  },
};
