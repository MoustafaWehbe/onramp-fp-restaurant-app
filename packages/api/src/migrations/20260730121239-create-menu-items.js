"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("menu_items", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      menu_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "menus",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      base_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      display_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      is_active: {
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

    await queryInterface.addIndex("menu_items", ["menu_id"]);
    await queryInterface.addConstraint("menu_items", {
      fields: ["base_price"],
      type: "check",
      where: {
        base_price: {
          [Sequelize.Op.gte]: 0,
        },
      },
      name: "menu_items_base_price_non_negative",
    });
  },

   async down(queryInterface) {
    await queryInterface.removeConstraint(
      "menu_items",
      "menu_items_base_price_non_negative"
    );

    await queryInterface.dropTable("menu_items");
  },
};