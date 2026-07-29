"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const restaurants = await queryInterface.sequelize.query(
      `SELECT id FROM restaurants`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!restaurants.length) {
      throw new Error(
        "Cannot seed admin logs: no restaurants found. Please seed restaurants first."
      );
    }

    const adminLogs = [];

    for (let i = 0; i < 15; i++) {
      adminLogs.push({
        user_id: users[i % users.length].id,
        action: faker.helpers.arrayElement([
          "approve_restaurant",
          "reject_restaurant",
          "update_restaurant",
          "delete_restaurant",
        ]),
        target_type: "restaurant",
        target_id: restaurants[i % restaurants.length].id,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("admin_logs", adminLogs);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("admin_logs", {
      action: {
        [Sequelize.Op.in]: [
          "approve_restaurant",
          "reject_restaurant",
          "update_restaurant",
          "delete_restaurant",
        ],
      },
    });
  },
};