"use strict";

const { QueryTypes } = require("sequelize");

const branchMenuItemIds = [
  "40000000-0000-0000-0000-000000000001",
  "40000000-0000-0000-0000-000000000002",
  "40000000-0000-0000-0000-000000000003",
];

const branchIds = [
  "10000000-0000-0000-0000-000000000001",
  "10000000-0000-0000-0000-000000000002",
];

const menuItemIds = [
  "30000000-0000-0000-0000-000000000001",
  "30000000-0000-0000-0000-000000000002",
  "30000000-0000-0000-0000-000000000003",
];

module.exports = {
  async up(queryInterface) {
    const branches = await queryInterface.sequelize.query(
      `SELECT id FROM branches WHERE id IN (
        '10000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000002'
      )`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const menuItems = await queryInterface.sequelize.query(
      `SELECT id FROM menu_items WHERE id IN (
        '30000000-0000-0000-0000-000000000001',
        '30000000-0000-0000-0000-000000000002',
        '30000000-0000-0000-0000-000000000003'
      )`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (branches.length < 2) {
      throw new Error(
        "Cannot seed branch menu items: required branches not found."
      );
    }

    if (menuItems.length < 3) {
      throw new Error(
        "Cannot seed branch menu items: required menu items not found."
      );
    }

    const branchMenuItems = [
      {
        id: branchMenuItemIds[0],
        branch_id: branchIds[0],
        menu_item_id: menuItemIds[0],
        custom_price: 8.00,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: branchMenuItemIds[1],
        branch_id: branchIds[0],
        menu_item_id: menuItemIds[1],
        custom_price: null,
        is_available: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: branchMenuItemIds[2],
        branch_id: branchIds[1],
        menu_item_id: menuItemIds[2],
        custom_price: 2.50,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert(
      "branch_menu_items",
      branchMenuItems
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("branch_menu_items", {
      id: {
        [Sequelize.Op.in]: branchMenuItemIds,
      },
    });
  },
};