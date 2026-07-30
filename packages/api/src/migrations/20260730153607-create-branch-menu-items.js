"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("branch_menu_items", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      branch_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "branches",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      menu_item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "menu_items",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      custom_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      is_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex("branch_menu_items", ["branch_id"]);
    await queryInterface.addIndex("branch_menu_items", ["menu_item_id"]);

    await queryInterface.addConstraint("branch_menu_items", {
      fields: ["branch_id", "menu_item_id"],
      type: "unique",
      name: "unique_branch_menu_item",
    });

    await queryInterface.addConstraint("branch_menu_items", {
      fields: ["custom_price"],
      type: "check",
      where: {
        custom_price: {
          [Sequelize.Op.gte]: 0,
        },
      },
      name: "branch_menu_items_custom_price_non_negative",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      "branch_menu_items",
      "branch_menu_items_custom_price_non_negative"
    );

    await queryInterface.removeConstraint(
      "branch_menu_items",
      "unique_branch_menu_item"
    );

    await queryInterface.dropTable("branch_menu_items");
  },
};