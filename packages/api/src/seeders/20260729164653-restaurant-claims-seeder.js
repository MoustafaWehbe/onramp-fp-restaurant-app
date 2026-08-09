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
      }
    );

    const users = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'owner'",
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!users.length) {
      throw new Error(
        "Cannot seed restaurant claims: no owners found."
      );
    }

    const claims = [];

    for (let i = 0; i < 10; i++) {
      const restaurant = restaurants.length
        ? restaurants[i % restaurants.length]
        : null;

      claims.push({
        id: claimIds[i],
        
        restaurant_id: i < 7 ? restaurant?.id ?? null : null,

        user_id: users[i % users.length].id,

        restaurant_name:
          restaurant?.name ??
          faker.company.name(),

        email:
          restaurant?.email ??
          faker.internet.email(),

        phone:
          restaurant?.phone ??
          faker.phone.number(),

        status: faker.helpers.arrayElement([
          "pending",
          "approved",
          "rejected",
        ]),

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