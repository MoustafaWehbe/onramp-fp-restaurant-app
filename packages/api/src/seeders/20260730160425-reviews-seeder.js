'use strict';
const { faker } = require('@faker-js/faker');

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
    const reviews = Array.from({ length: 100 }, () => {
      const rating = faker.number.int({ min: 1, max: 5 });
      return {
        id: faker.string.uuid(),
        user_id: faker.helpers.arrayElement(users).id,
        branch_id: faker.helpers.arrayElement(branches).id,
        comment: faker.lorem.sentences(2),
        rating,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
    });
    await queryInterface.bulkInsert('reviews', reviews);
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM reviews WHERE comment IN (
        SELECT comment FROM reviews LIMIT 0
      );`
    );
  },
};