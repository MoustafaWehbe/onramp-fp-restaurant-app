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

    await queryInterface.addIndex("branch_menu_items", [
      "branch_id",
      "menu_item_id",
    ], {
      unique: true,
      name: "unique_branch_menu_item_active",
      where: {
        deleted_at: null,
      },
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

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION validate_branch_menu_item_restaurant()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM branches b
          JOIN menu_items mi ON mi.id = NEW.menu_item_id
          JOIN menus m ON m.id = mi.menu_id
          WHERE b.id = NEW.branch_id
          AND b.restaurant_id = m.restaurant_id
        ) THEN
          RAISE EXCEPTION 'Branch and menu item must belong to the same restaurant';
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER branch_menu_item_restaurant_check
      BEFORE INSERT OR UPDATE ON branch_menu_items
      FOR EACH ROW
      EXECUTE FUNCTION validate_branch_menu_item_restaurant();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
    DROP TRIGGER IF EXISTS branch_menu_item_restaurant_check
    ON branch_menu_items;
  `);

    await queryInterface.sequelize.query(`
    DROP FUNCTION IF EXISTS validate_branch_menu_item_restaurant();
  `);

    await queryInterface.removeConstraint(
      "branch_menu_items",
      "branch_menu_items_custom_price_non_negative"
    );

    await queryInterface.removeIndex(
      "branch_menu_items",
      "unique_branch_menu_item_active"
    );

    await queryInterface.dropTable("branch_menu_items");
  }
};