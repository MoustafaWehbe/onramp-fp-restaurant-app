'use strict';
const { faker } = require('@faker-js/faker');

const BRANCH_IMAGE_IDS = Array.from({ length: 100 }, () => faker.string.uuid());

module.exports = {
  async up(queryInterface) {
    const branches = await queryInterface.sequelize.query(
      'SELECT id FROM branches;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    if (branches.length === 0) {
      throw new Error('Branches must be seeded before branch images.');
    }

    const imageTypes = ['main', 'gallery', 'exterior', 'interior'];

    const branchImages = BRANCH_IMAGE_IDS.map((id) => ({
      id,
      branch_id: faker.helpers.arrayElement(branches).id,
      url: faker.image.urlPicsumPhotos(),
      type: faker.helpers.arrayElement(imageTypes),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }));

    await queryInterface.bulkInsert('branch_images', branchImages);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('branch_images', { id: BRANCH_IMAGE_IDS }, {});
  },
};