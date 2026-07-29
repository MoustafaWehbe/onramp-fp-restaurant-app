'use strict';

const { faker } = require("@faker-js/faker");

const restaurantIds = [
  "00000000-0000-0000-0000-000000000001",
  "00000000-0000-0000-0000-000000000002",
  "00000000-0000-0000-0000-000000000003",
];

const branches = [];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for(let i = 0 ; i < 10 ; i ++) {
      branches.push({
        id: faker.string.uuid(),
        restaurant_id: restaurantIds[i % restaurantIds.length],
        name: `${faker.location.city()} Branch`,
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        latitude: faker.location.latitude({
          max: 34.7,
          min: 33.0,
          precision: 0.000001,
        }),
        longitude: faker.location.longitude({
          max: 36.7,
          min: 35.0,
          precision: 0.000001,
        }),
        phone: faker.phone.number(),
        opening_hours: "09:00 - 23:00",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert("branches",branches);
  },

  async down (queryInterface, Sequelize) {
    if (branches.length === 0) return;
    await queryInterface.bulkDelete("branches", {
      id: branches.map((branch) => branch.id),
    });
  }
};
