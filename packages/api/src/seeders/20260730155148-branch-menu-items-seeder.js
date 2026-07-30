"use strict";

const { QueryTypes } = require("sequelize");

const branchMenuItemIds = [
  "40000000-0000-0000-0000-000000000001",
  "40000000-0000-0000-0000-000000000002",
  "40000000-0000-0000-0000-000000000003",
];

module.exports = {
  async up(queryInterface) {
    const branchMenuItems = await queryInterface.sequelize.query(
      `
      SELECT 
        b.id AS branch_id,
        mi.id AS menu_item_id
      FROM branches b
      JOIN menus m 
        ON m.restaurant_id = b.restaurant_id
      JOIN menu_items mi 
        ON mi.menu_id = m.id
      LIMIT 3;
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (branchMenuItems.length < 3) {
      throw new Error(
        "Cannot seed branch menu items: not enough matching branches and menu items found."
      );
    }

    await queryInterface.bulkInsert("branch_menu_items", [
      {
        id: branchMenuItemIds[0],
        branch_id: branchMenuItems[0].branch_id,
        menu_item_id: branchMenuItems[0].menu_item_id,
        custom_price: 8.00,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: branchMenuItemIds[1],
        branch_id: branchMenuItems[1].branch_id,
        menu_item_id: branchMenuItems[1].menu_item_id,
        custom_price: null,
        is_available: false,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: branchMenuItemIds[2],
        branch_id: branchMenuItems[2].branch_id,
        menu_item_id: branchMenuItems[2].menu_item_id,
        custom_price: 2.50,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("branch_menu_items", {
      id: {
        [Sequelize.Op.in]: branchMenuItemIds,
      },
    });
  },
};