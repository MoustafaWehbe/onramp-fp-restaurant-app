"use strict";

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash("Admin1234!", 12);

    await queryInterface.bulkInsert("users", [
      {
        id: "00000000-0000-0000-0000-000000000001",
        email: "admin@example.com",
        password_hash: passwordHash,
        name: "Admin User",
        role: "admin",
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: "10000000-0000-0000-0000-000000000002",
        email: "owner1@example.com",
        password_hash: passwordHash,
        name: "Owner One",
        role: "owner",
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: "10000000-0000-0000-0000-000000000003",
        email: "owner2@example.com",
        password_hash: passwordHash,
        name: "Owner Two",
        role: "owner",
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: "10000000-0000-0000-0000-000000000004",
        email: "owner3@example.com",
        password_hash: passwordHash,
        name: "Owner Three",
        role: "owner",
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: "10000000-0000-0000-0000-000000000005",
        email: "owner4@example.com",
        password_hash: passwordHash,
        name: "Owner Four",
        role: "owner",
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        id: "10000000-0000-0000-0000-000000000006",
        email: "owner5@example.com",
        password_hash: passwordHash,
        name: "Owner Five",
        role: "owner",
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: [
        "admin@example.com",
        "owner1@example.com",
        "owner2@example.com",
        "owner3@example.com",
        "owner4@example.com",
        "owner5@example.com",
      ],
    });
  },
};