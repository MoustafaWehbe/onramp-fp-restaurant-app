'use strict';

const { faker } = require('@faker-js/faker');

const restaurantIds = [
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000007',
  '00000000-0000-0000-0000-000000000008',
  '00000000-0000-0000-0000-000000000009',
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000013',
  '00000000-0000-0000-0000-000000000014',
  '00000000-0000-0000-0000-000000000015',
];

module.exports = {
  async up(queryInterface) {
    const restaurants = restaurantIds.map((id) => ({
      id,
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
    }));

    await queryInterface.bulkInsert('restaurants', restaurants);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants', {
      id: {
        [Sequelize.Op.in]: restaurantIds,
      },
    });
  },
};