"use strict";

const { QueryTypes } = require("sequelize");

const menuIds = [
  "20000000-0000-0000-0000-000000000001",
  "20000000-0000-0000-0000-000000000002",
  "20000000-0000-0000-0000-000000000003",
];

module.exports = {
  async up(queryInterface) {
    const restaurants = await queryInterface.sequelize.query(
      "SELECT id FROM restaurants",
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!restaurants.length) {
      throw new Error("Cannot seed menus: no restaurants found.");
    }

    const menus = [
      {
        id: menuIds[0],
        restaurant_id: restaurants[0].id,
        name: "Main Menu",
        description: "Main restaurant dishes",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: menuIds[1],
        restaurant_id: restaurants[0].id,
        name: "Drinks Menu",
        description: "Hot and cold beverages",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: menuIds[2],
        restaurant_id: restaurants[1 % restaurants.length].id,
        name: "Special Menu",
        description: "Chef special selections",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("menus", menus);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("menus", {
      id: {
        [Sequelize.Op.in]: menuIds,
      },
    });
  },
};