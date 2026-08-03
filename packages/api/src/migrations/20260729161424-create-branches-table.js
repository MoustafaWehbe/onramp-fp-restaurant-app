'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('branches', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      restaurant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "restaurants",
          key: "id"
        },
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      opening_hours: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      review_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      average_rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      }
    });
    await queryInterface.addIndex("branches", ["restaurant_id"]);

    await queryInterface.addConstraint("branches", {
      fields: ["restaurant_id", "slug"],
      type: "unique",
      name: "branches_restaurant_id_slug_unique",
    });
    
    await queryInterface.addConstraint("branches", {
      fields: ["average_rating"],
      type: "check",
      where: {
        average_rating: {
          [Sequelize.Op.between]: [0, 5],
        },
      },
      name: "branches_average_rating_range",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("branches");
  }
};
