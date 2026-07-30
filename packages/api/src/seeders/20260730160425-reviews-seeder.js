'use strict';
const { faker } = require('@faker-js/faker');

const REVIEW_IDS = [
  'a1b2c3d4-0001-4000-8000-000000000001',
  'a1b2c3d4-0002-4000-8000-000000000002',
  'a1b2c3d4-0003-4000-8000-000000000003',
];

module.exports = {
  async up(queryInterface) {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const branches = await queryInterface.sequelize.query(
      'SELECT id FROM branches;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (users.length === 0 || branches.length === 0) {
      throw new Error('Users and branches must be seeded before reviews.');
    }

    const reviews = REVIEW_IDS.map((id) => ({
      id,
      user_id: faker.helpers.arrayElement(users).id,
      branch_id: faker.helpers.arrayElement(branches).id,
      comment: faker.lorem.sentences(2),
      rating: faker.number.int({ min: 1, max: 5 }),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }));

    await queryInterface.bulkInsert('reviews', reviews);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('reviews', { id: REVIEW_IDS }, {});
  },
};