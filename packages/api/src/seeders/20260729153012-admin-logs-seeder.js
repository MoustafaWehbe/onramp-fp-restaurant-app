"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users LIMIT 15;"
    );

    if (users.length === 0) {
      throw new Error("No users found. Seed users first.");
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
        target_id: faker.string.uuid(),
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