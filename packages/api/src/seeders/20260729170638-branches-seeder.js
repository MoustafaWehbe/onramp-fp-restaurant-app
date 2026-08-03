'use strict';

const { faker } = require("@faker-js/faker");

const restaurantIds = [
  "00000000-0000-0000-0000-000000000001",
  "00000000-0000-0000-0000-000000000002",
  "00000000-0000-0000-0000-000000000003",
];

const BRANCH_COUNT = 10;

const getBranchId = (index) =>
  `10000000-0000-0000-0000-${String(index + 1).padStart(12, "0")}`;


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const branches = [];
    const branchNames = [
      "Hamra",
      "Verdun",
      "Downtown",
      "Achrafieh",
      "Jounieh",
    ];
    for (let i = 0; i < 10; i++) {
      const restaurantId = restaurantIds[i % restaurantIds.length];
      const name = branchNames[i % branchNames.length];
      branches.push({
        id: getBranchId(i),
        restaurant_id: restaurantId,
        name,
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        latitude: faker.location.latitude({
          max: 34.7,
          min: 33.0,
        }),
        longitude: faker.location.longitude({
          max: 36.7,
          min: 35.0,
        }),
        phone: faker.phone.number(),
        opening_hours: "09:00 - 23:00",
        review_count: faker.number.int({
          min: 0,
          max: 5000,
        }),
        average_rating: faker.number.float({
          min: 0,
          max: 5,
          fractionDigits: 2,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert("branches", branches);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("branches", {
      id: Array.from(
        { length: BRANCH_COUNT },
        (_, i) => getBranchId(i)
      ),
    });
  }
};
