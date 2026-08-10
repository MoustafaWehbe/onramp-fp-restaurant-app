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

const restaurantImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  "https://images.unsplash.com/photo-1547592180-85f173990554",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330",
  "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec",
  "https://images.unsplash.com/photo-1543353071-10c8ba85a904",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de",
  "https://images.unsplash.com/photo-1579684947550-22e945225d9a",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2",
];

const cuisineTypes = [
  'Italian',
  'Japanese',
  'Mexican',
  'Chinese',
  'Indian',
  'French',
  'Lebanese',
  'American',
];

const ambianceTags = [
  'Family Friendly',
  'Romantic',
  'Outdoor Seating',
  'Pet Friendly',
  'Live Music',
  'Casual',
  'Fine Dining',
  'Rooftop',
];

const priceRanges = ['Budget', 'Average', 'Expensive', 'Luxury'];

module.exports = {
  async up(queryInterface) {
    const restaurants = restaurantIds.map((id, index) => {
      const name = faker.company.name();

      return {
        id,
        name,
        image_url: restaurantImages[index],
        slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id.slice(-4)}`,
        description: faker.lorem.sentence(),
        cuisine_type: faker.helpers.arrayElement(cuisineTypes),
        ambiance_tags: JSON.stringify(
          faker.helpers.arrayElements(ambianceTags, {
            min: 1,
            max: 3,
          }),
        ),
        price_range: faker.helpers.arrayElement(priceRanges),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        review_count: faker.number.int({
          min: 0,
          max: 5000,
        }),
        average_rating: faker.number.float({
          min: 0,
          max: 5,
          fractionDigits: 2,
        }),
        verified_at: faker.datatype.boolean() ? new Date() : null,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });
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