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

        console.log(
            "DATABASE FILTERS:",
            JSON.stringify(filters, null, 2)
        );

        const sequelize = getSequelize();

        const restaurantWhere: any = {};
        const branchWhere: any = {};
        const menuWhere: any = {
            is_active: true,
        };
        const menuItemWhere: any = {
            is_active: true,
        };

        if (filters.cuisine?.length) {
            restaurantWhere.cuisine_type = {
                [Op.or]: filters.cuisine.map((cuisine) => ({
                    [Op.iLike]: `%${cuisine}%`,
                })),
            };
        }

        if (filters.ambianceTags?.length) {
            restaurantWhere[Op.and] = [
                ...(restaurantWhere[Op.and] ?? []),
                ...filters.ambianceTags.map((tag) =>
                    Sequelize.literal(`
                        EXISTS (
                            SELECT 1
                            FROM json_array_elements_text(
                                "Restaurant"."ambiance_tags"
                            ) AS ambiance_tag
                            WHERE ambiance_tag = ${sequelize.escape(tag)}
                        )
                    `)
                ),
            ];
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

        if (filters.isOpenNow !== undefined) {
            branchWhere[Op.and] = [
                ...(branchWhere[Op.and] ?? []),
                buildIsOpenNowCondition(filters.isOpenNow),
            ];
        }

        const hasBranchFilter =
            Boolean(filters.city?.length) ||
            filters.isOpenNow !== undefined;

        if (filters.menuName) {
            menuWhere.name = {
                [Op.iLike]: `%${filters.menuName}%`,
            };
        }

        const hasMenuFilter = Boolean(filters.menuName);

        if (filters.menuItemName) {
            menuItemWhere.name = {
                [Op.iLike]: `%${filters.menuItemName}%`,
            };
        }

        const hasMenuItemFilter =
            Boolean(filters.menuItemName) ||
            filters.minItemPrice !== undefined ||
            filters.maxItemPrice !== undefined;

        const branchInclude: any = {
            model: Branch,
            as: "branches",
            required: hasBranchFilter,
            where: branchWhere,
        };

        const menuInclude: any = {
            model: Menu,
            as: "menus",
            required: hasMenuFilter || hasMenuItemFilter,
            where: menuWhere,
        };

        if (hasMenuItemFilter) {
            menuInclude.include = [
                {
                    model: MenuItem,
                    as: "menuItems",
                    required: true,
                    where: menuItemWhere,
                },
            ];
        }

        if (hasBranchFilter) {
            branchInclude.include = [
                {
                    model: BranchMenuItem,
                    as: "branchMenuItems",
                    required: false,
                },
            ];
        }

        return Restaurant.findAndCountAll({

            logging: (sql) => {
                console.log("\n========== SQL ==========");
                console.log(sql);
                console.log("=========================\n");
            },

            where: restaurantWhere,

            distinct: true,

            limit,
            offset,

            include: [
                branchInclude,
                menuInclude,
            ],
        });
    },
};