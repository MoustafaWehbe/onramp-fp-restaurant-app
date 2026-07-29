"use strict";

const { QueryTypes } = require("sequelize");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface) {
    const restaurants = await queryInterface.sequelize.query(
      "SELECT id FROM restaurants",
      {
        type: QueryTypes.SELECT,
      }
    );

    const users = await queryInterface.sequelize.query(
      "SELECT id FROM users",
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!restaurants.length) {
      throw new Error(
        "Cannot seed restaurant claims: no restaurants found."
      );
    }

    if (!users.length) {
      throw new Error(
        "Cannot seed restaurant claims: no users found."
      );
    }

    const claims = [];

    for (let i = 0; i < 10; i++) {
      claims.push({
        id: faker.string.uuid(),
        restaurant_id: restaurants[i % restaurants.length].id,
        user_id: users[i % users.length].id,
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

  async down(queryInterface) {
    await queryInterface.bulkDelete("restaurant_claims", null, {});
  },
};