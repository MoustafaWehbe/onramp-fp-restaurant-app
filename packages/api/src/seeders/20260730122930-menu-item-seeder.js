"use strict";

const { QueryTypes } = require("sequelize");

const menuItemIds = [
  "30000000-0000-0000-0000-000000000001",
  "30000000-0000-0000-0000-000000000002",
  "30000000-0000-0000-0000-000000000003",
  "30000000-0000-0000-0000-000000000004",
];

module.exports = {
  async up(queryInterface) {
    const menus = await queryInterface.sequelize.query(
      "SELECT id, name FROM menus",
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!menus.length) {
      throw new Error("Cannot seed menu items: no menus found.");
    }

    const mainMenu = menus.find(
      (menu) => menu.name === "Main Menu"
    );

    const drinksMenu = menus.find(
      (menu) => menu.name === "Drinks Menu"
    );

    if (!mainMenu || !drinksMenu) {
      throw new Error(
        "Cannot seed menu items: required menus not found."
      );
    }

    const menuItems = [
      {
        id: menuItemIds[0],
        menu_id: mainMenu.id,
        name: "Classic Burger",
        description: "Beef burger with fresh vegetables",
        base_price: 10.00,
        image_url: "https://example.com/burger.jpg",
        display_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: menuItemIds[1],
        menu_id: mainMenu.id,
        name: "French Fries",
        description: "Crispy golden fries",
        base_price: 4.00,
        image_url: "https://example.com/fries.jpg",
        display_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: menuItemIds[2],
        menu_id: drinksMenu.id,
        name: "Orange Juice",
        description: "Fresh orange juice",
        base_price: 3.50,
        image_url: "https://example.com/orange-juice.jpg",
        display_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: menuItemIds[3],
        menu_id: drinksMenu.id,
        name: "Coffee",
        description: "Hot coffee",
        base_price: 2.50,
        image_url: "https://example.com/coffee.jpg",
        display_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("menu_items", menuItems);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("menu_items", {
      id: {
        [Sequelize.Op.in]: menuItemIds,
      },
    });
  },
};