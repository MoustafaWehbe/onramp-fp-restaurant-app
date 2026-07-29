"use strict";

const { QueryTypes } = require("sequelize");

const favoriteIds = [
  "10000000-0000-0000-0000-000000000001",
  "10000000-0000-0000-0000-000000000002",
  "10000000-0000-0000-0000-000000000003",
  "10000000-0000-0000-0000-000000000004",
  "10000000-0000-0000-0000-000000000005",
];

module.exports = {
  async up(queryInterface) {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM users",
      {
        type: QueryTypes.SELECT,
      }
    );

    const restaurants = await queryInterface.sequelize.query(
      "SELECT id FROM restaurants",
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!users.length) {
      throw new Error("Cannot seed favorites: no users found.");
    }

    if (!restaurants.length) {
      throw new Error("Cannot seed favorites: no restaurants found.");
    }

    const favorites = favoriteIds.map((id, index) => ({
      id,
      user_id: users[index % users.length].id,
      restaurant_id: restaurants[index % restaurants.length].id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("favorites", favorites);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("favorites", {
      id: {
        [Sequelize.Op.in]: favoriteIds,
      },
    });
  },
};