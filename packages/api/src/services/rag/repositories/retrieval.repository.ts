import { Op, Sequelize } from "sequelize";

import { Restaurant } from "../../../models/Restaurant";
import { Branch } from "../../../models/Branch";
import { Menu } from "../../../models/Menu";
import { MenuItem } from "../../../models/MenuItem";
import { BranchMenuItem } from "../../../models/BranchMenuItem";

import { getSequelize } from "@fp_restaurant/shared";

import type { ValidatedRetrievalPlan } from "../query/query-schema";


type RetrievalFilters = NonNullable<
  ValidatedRetrievalPlan["filters"]
>;


const FILTER_LEVELS = {
  branch: [
    "city",
    "isOpenNow",
  ] as const,

  branchMenuItem: [
    "minItemPrice",
    "maxItemPrice",
  ] as const,

  menuItem: [
    "menuItemName",
    "minItemPrice",
    "maxItemPrice",
  ] as const,

  menu: [
    "menuName",
  ] as const,
};


function anyFilterPresent<
  K extends readonly (keyof RetrievalFilters)[]
>(
  filters: RetrievalFilters,
  keys: K
): boolean {
  return keys.some(
    (key) =>
      filters[key] !== undefined &&
      filters[key] !== null
  );
}


export const retrievalRepository = {

  async searchEmbedding(
    embedding: number[],
    limit = 10
  ) {
    const sequelize = getSequelize();

    const vector = `[${embedding.join(",")}]`;

    const [results] = await sequelize.query(
      `
      SELECT
        id,
        content,
        metadata,
        embedding <=> :embedding AS distance
      FROM embeddings
      ORDER BY embedding <=> :embedding
      LIMIT :limit
      `,
      {
        replacements: {
          embedding: vector,
          limit,
        },
      }
    );

    return results;
  },


  async searchRestaurants(
    filters: RetrievalFilters,
    limit = 20,
    offset = 0
  ) {
    const sequelize = getSequelize();

    const restaurantWhere: any = {};

    const branchWhere: any = {};

    const menuWhere: any = {
      is_active: true,
    };

    const menuItemWhere: any = {
      is_active: true,
    };

    const branchMenuItemWhere: any = {
      isAvailable: true,
    };


    if (filters.cuisine) {
      restaurantWhere.cuisine_type = {
        [Op.iLike]: `%${filters.cuisine}%`,
      };
    }


    if (filters.price) {
      restaurantWhere.price_range =
        filters.price;
    }


    if (filters.minRating !== undefined) {
      restaurantWhere.average_rating = {
        [Op.gte]: filters.minRating,
      };
    }


    if (filters.maxRating !== undefined) {
      restaurantWhere.average_rating = {
        ...(restaurantWhere.average_rating ?? {}),
        [Op.lte]: filters.maxRating,
      };
    }


    if (filters.city) {
      branchWhere.city = {
        [Op.iLike]: `%${filters.city}%`,
      };
    }


    if (filters.menuName) {
      menuWhere.name = {
        [Op.iLike]: `%${filters.menuName}%`,
      };
    }


    if (filters.menuItemName) {
      menuItemWhere.name = {
        [Op.iLike]: `%${filters.menuItemName}%`,
      };
    }


    const priceConditions: any[] = [];


    if (filters.minItemPrice !== undefined) {
      priceConditions.push(
        sequelize.where(
          Sequelize.literal(
            `
            COALESCE(
              "Branches->BranchMenuItems"."custom_price",
              "Branches->BranchMenuItems->MenuItem"."base_price"
            )
            `
          ),
          {
            [Op.gte]: filters.minItemPrice,
          }
        )
      );
    }


    if (filters.maxItemPrice !== undefined) {
      priceConditions.push(
        sequelize.where(
          Sequelize.literal(
            `
            COALESCE(
              "Branches->BranchMenuItems"."custom_price",
              "Branches->BranchMenuItems->MenuItem"."base_price"
            )
            `
          ),
          {
            [Op.lte]: filters.maxItemPrice,
          }
        )
      );
    }


    if (priceConditions.length > 0) {
      branchMenuItemWhere[Op.and] =
        priceConditions;
    }


    const branchRequired = anyFilterPresent(
      filters,
      [
        ...FILTER_LEVELS.branch,
        ...FILTER_LEVELS.branchMenuItem,
        ...FILTER_LEVELS.menuItem,
      ]
    );


    const branchMenuItemRequired =
      anyFilterPresent(
        filters,
        [
          ...FILTER_LEVELS.branchMenuItem,
          ...FILTER_LEVELS.menuItem,
        ]
      );


    const menuItemRequired =
      anyFilterPresent(
        filters,
        FILTER_LEVELS.menuItem
      );


    const menuRequired =
      anyFilterPresent(
        filters,
        FILTER_LEVELS.menu
      );


    return Restaurant.findAndCountAll({

      where: restaurantWhere,

      distinct: true,

      limit,

      offset,


      include: [

        {
          model: Branch,

          required: branchRequired,

          where: branchWhere,


          include: [

            {
              model: BranchMenuItem,

              required: branchMenuItemRequired,

              where: branchMenuItemWhere,


              include: [

                {
                  model: MenuItem,

                  required: menuItemRequired,

                  where: menuItemWhere,

                },

              ],

            },

          ],

        },


        {
          model: Menu,

          required: menuRequired,

          where: menuWhere,

        },

      ],

    });
  },

};