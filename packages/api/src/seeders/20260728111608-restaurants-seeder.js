'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      const restaurants = [];
    //seeding 15 restaurants in the db
    for (let i = 0; i < 15; i++) {
      restaurants.push({
        id: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        phone: faker.phone.number(),
        image_url: faker.image.url(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert('restaurants',restaurants);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants', null, {});
  }
};
