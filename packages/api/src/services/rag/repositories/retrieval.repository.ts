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
    restaurant: [
        "cuisine",
        "price",
        "minRating",
        "maxRating",
        "ambianceTags",
    ] as const,

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
        "menuItemDescription",
    ] as const,

    menu: [
        "menuName",
        "menuDescription",
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

function buildIsOpenNowCondition(
    isOpenNow: boolean
) {
    const openingHoursColumn =
        `"branches"."opening_hours"`;

    const currentTimeExpression = `
    (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Beirut')::time
  `;

    const startTimeExpression = `
    split_part(${openingHoursColumn}, '-', 1)::time
  `;

    const endTimeExpression = `
    split_part(${openingHoursColumn}, '-', 2)::time
  `;

    const validOpeningHoursExpression = `
    ${openingHoursColumn} ~ '^([01][0-9]|2[0-3]):[0-5][0-9]-([01][0-9]|2[0-3]):[0-5][0-9]$'
  `;

    const openExpression = `
    CASE
      WHEN NOT (${validOpeningHoursExpression})
        THEN FALSE

      WHEN ${startTimeExpression} = ${endTimeExpression}
        THEN TRUE

      WHEN ${startTimeExpression} < ${endTimeExpression}
        THEN (
          ${currentTimeExpression} >= ${startTimeExpression}
          AND
          ${currentTimeExpression} <= ${endTimeExpression}
        )

      WHEN ${startTimeExpression} > ${endTimeExpression}
        THEN (
          ${currentTimeExpression} >= ${startTimeExpression}
          OR
          ${currentTimeExpression} <= ${endTimeExpression}
        )

      ELSE FALSE
    END
  `;

    return Sequelize.literal(
        `(${openExpression}) = ${isOpenNow ? "TRUE" : "FALSE"}`
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
            entity_type AS "entityType",
            entity_id AS "entityId",
            content,
            metadata,
            embedding <=> :embedding AS distance
        FROM search_embeddings
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

        if (filters.cuisine?.length) {
            restaurantWhere.cuisine_type = {
                [Op.or]: filters.cuisine.map((cuisine) => ({
                    [Op.iLike]: `%${cuisine}%`,
                })),
            };
        }

        if (filters.ambianceTags?.length) {
            restaurantWhere.ambiance_tags = {
                [Op.overlap]: filters.ambianceTags,
            };
        }

        if (filters.price) {
            restaurantWhere.price_range = filters.price;
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

        if (filters.city?.length) {
            branchWhere[Op.or] = filters.city.map((city) => ({
                city: {
                    [Op.iLike]: `%${city}%`,
                },
            }));
        }
        //isOpenNow is calculated from opening hours column 

        if (filters.isOpenNow !== undefined) {
            branchWhere[Op.and] = [
                ...(branchWhere[Op.and] ?? []),
                buildIsOpenNowCondition(filters.isOpenNow),
            ];
        }


        if (filters.menuName) {
            menuWhere.name = {
                [Op.iLike]: `%${filters.menuName}%`,
            };
        }

        if (filters.menuDescription) {
            menuWhere.description = {
                [Op.iLike]: `%${filters.menuDescription}%`,
            };
        }

        if (filters.menuItemName) {
            menuItemWhere.name = {
                [Op.iLike]: `%${filters.menuItemName}%`,
            };
        }

        if (filters.menuItemDescription) {
            menuItemWhere.description = {
                [Op.iLike]: `%${filters.menuItemDescription}%`,
            };
        }

        const priceConditions: any[] = [];

        if (filters.minItemPrice !== undefined) {
            priceConditions.push(
                sequelize.where(
                    Sequelize.literal(`
                        COALESCE(
                            "branches->branchMenuItems"."custom_price",
                            "branches->branchMenuItems->menuItem"."base_price"
                        )
                    `),
                    {
                        [Op.gte]: filters.minItemPrice,
                    }
                )
            );
        }

        if (filters.maxItemPrice !== undefined) {
            priceConditions.push(
                sequelize.where(
                    Sequelize.literal(`
                    COALESCE(
                            "branches->branchMenuItems"."custom_price",
                            "branches->branchMenuItems->menuItem"."base_price"
                        )
                    `),
                    {
                        [Op.lte]: filters.maxItemPrice,
                    }
                )
            );
        }

        if (priceConditions.length > 0) {
            branchMenuItemWhere[Op.and] = priceConditions;
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
                    as: "branches",

                    required: branchRequired,

                    where: branchWhere,

                    include: [
                        {
                            model: BranchMenuItem,
                            as: "branchMenuItems",

                            required: branchMenuItemRequired,

                            where: branchMenuItemWhere,

                            include: [
                                {
                                    model: MenuItem,
                                    as: "menuItem",

                                    required: menuItemRequired,

                                    where: menuItemWhere,
                                },
                            ],
                        },
                    ],
                },

                {
                    model: Menu,
                    as: "menus",

                    required: menuRequired,

                    where: menuWhere,
                },
            ],
        });
    },
};