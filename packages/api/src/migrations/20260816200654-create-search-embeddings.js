"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("search_embeddings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      entity_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      entity_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      embedding: {
        type: "VECTOR(768)",
        allowNull: true,
      },

      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
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
    });

    await queryInterface.addConstraint("search_embeddings", {
      fields: ["entity_type", "entity_id"],
      type: "unique",
      name: "search_embeddings_entity_type_entity_id_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("search_embeddings");
  },
};