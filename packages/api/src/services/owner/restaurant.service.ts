import { Restaurant, RestaurantClaim } from "@starter-kit/shared";
import { UniqueConstraintError } from "sequelize";
import { generateSlug } from "src/lib/slug";
import { createError } from "src/middleware/error-handler";
import { getDatabase } from "src/lib/db";

interface CreateRestaurantData {
    userId: string;
    image_url: string;
    description: string;
    cuisine_type: string;
    ambiance_tags: string[];
    price_range: string;
}

interface UpdateRestaurantData {
    name?: string;
    image_url?: string;
    description?: string;
    cuisine_type?: string;
    ambiance_tags?: string[];
    price_range?: string;
    email?: string;
    phone?: string;
}

export const restaurantService = {
    create: async ({
        userId,
        image_url,
        description,
        cuisine_type,
        ambiance_tags,
        price_range,
    }: CreateRestaurantData) => {
        const claim = await RestaurantClaim.findOne({
            where: {
                userId,
                restaurantId: null,
                status: "approved",
            },
        });

        if (!claim) {
            throw createError(
                "You do not have an approved restaurant claim for a new restaurant",
                403,
            );
        }

        const slug = generateSlug(claim.restaurantName);

        if (!slug) {
            throw createError(
                "Restaurant name must contain at least one alphanumeric character",
                400,
            );
        }

        try {
            const restaurant = await getDatabase().transaction(
                async (transaction) => {
                    const created = await Restaurant.create(
                        {
                            name: claim.restaurantName,
                            email: claim.email,
                            phone: claim.phone,
                            image_url,
                            slug,
                            description,
                            cuisine_type,
                            ambiance_tags,
                            price_range,
                            review_count: 0,
                            average_rating: 0,
                        },
                        { transaction },
                    );

                    // Keep restaurantId here because it is
                    // the foreign key stored in RestaurantClaim.
                    await claim.update(
                        {
                            restaurantId: created.id,
                            status: "completed",
                        },
                        { transaction },
                    );

                    return created;
                },
            );

            return restaurant;
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                const constraint = (
                    error.parent as {
                        constraint?: string;
                    }
                )?.constraint;

                if (constraint === "restaurants_slug_unique") {
                    throw createError(
                        "A restaurant with this name already exists",
                        409,
                    );
                }
            }

            throw error;
        }
    },

    update: async (
        slug: string,
        data: UpdateRestaurantData,
    ) => {
        const restaurant = await Restaurant.findOne({
            where: {
                slug,
            },
        });

        if (!restaurant) {
            throw createError(
                "Restaurant not found",
                404,
            );
        }

        const updateData: Record<string, unknown> = {
            ...data,
        };

        if (
            data.name &&
            data.name !== restaurant.name
        ) {
            const newSlug = generateSlug(data.name);

            if (!newSlug) {
                throw createError(
                    "Restaurant name must contain at least one alphanumeric character",
                    400,
                );
            }

            const existingRestaurant =
                await Restaurant.findOne({
                    where: {
                        slug: newSlug,
                    },
                });

            if (
                existingRestaurant &&
                existingRestaurant.id !== restaurant.id
            ) {
                throw createError(
                    "A restaurant with this name already exists",
                    409,
                );
            }

            updateData.slug = newSlug;
        }

        try {
            await getDatabase().transaction(
                async (transaction) => {
                    await restaurant.update(
                        updateData,
                        { transaction },
                    );
                },
            );

            return restaurant;
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                const constraint = (
                    error.parent as {
                        constraint?: string;
                    }
                )?.constraint;

                if (constraint === "restaurants_slug_unique") {
                    throw createError(
                        "A restaurant with this name already exists",
                        409,
                    );
                }
            }

            throw error;
        }
    },

    getBySlug: async (slug: string) => {
        const restaurant = await Restaurant.findOne({
            where: {
                slug,
            },
        });

        if (!restaurant) {
            throw createError(
                "Restaurant not found",
                404,
            );
        }

        return restaurant;
    },
};