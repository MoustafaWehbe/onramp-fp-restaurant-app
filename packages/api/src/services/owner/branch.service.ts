import { Branch } from "src/models/Branch";
import { generateSlug } from "src/lib/slug";
import { createError } from "src/middleware/error-handler";
import { Menu, Restaurant, Review, User } from "@starter-kit/shared";

interface CreateBranchData {
    restaurantId: string;
    name: string;
    city: string;
    address: string;
    latitude: string;
    longitude: string;
    phone?: string | null;
    opening_hours: string;
}

export const branchService = {
    create: async ({
        restaurantId,
        name,
        city,
        address,
        latitude,
        longitude,
        phone,
        opening_hours,
    }: CreateBranchData) => {
        const baseSlug = generateSlug(name);
        let slug = baseSlug;

        const existingBranch = await Branch.findOne({
            where: {
                restaurantId,
                slug,
            },
        });

        if (existingBranch) {
            let counter = 2;

            while (
                await Branch.findOne({
                    where: {
                        restaurantId,
                        slug: `${baseSlug}-${counter}`,
                    },
                })
            ) {
                counter++;
            }

            slug = `${baseSlug}-${counter}`;
        }

        const branch = await Branch.create({
            restaurantId,
            name,
            slug,
            city,
            address,
            latitude,
            longitude,
            phone: phone ?? null,
            opening_hours,
            review_count: 0,
            average_rating: 0,
        });

        return branch;
    },

    update: async (
        restaurantId: string,
        branchId: string,
        data: Partial<CreateBranchData>,
    ) => {
        const branch = await Branch.findOne({
            where: {
                id: branchId,
                restaurantId,
            },
        });

        if (!branch) {
            throw createError("Branch not found", 404);
        }

        await branch.update(data);

        return branch;
    },

    delete: async (
        restaurantId: string,
        branchId: string,
    ) => {
        const branch = await Branch.findOne({
            where: {
                id: branchId,
                restaurantId,
            },
        });

        if (!branch) {
            throw createError("Branch not found", 404);
        }

        await branch.destroy();
    },

    getAll: async (restaurantId: string) => {
        const branches = await Branch.findAll({
            where: {
                restaurantId,
            },
            order: [["createdAt", "DESC"]],
        });

        return branches;
    },

    getById: async (
        restaurantId: string,
        branchId: string,
    ) => {
        const restaurant = await Restaurant.findOne({
            where: {
                id: restaurantId,
            },
            include: [
                {
                    model: Menu,
                    as: "menus",
                    where: {
                        is_active: true,
                    },
                    required: false,
                    attributes: [
                        "id",
                        "name",
                    ],
                },
            ],
        });

        if (!restaurant) {
            throw createError("Restaurant not found", 404);
        }

        const branch = await Branch.findOne({
            where: {
                id: branchId,
                restaurantId,
            },
            attributes: [
                "id",
                "restaurantId",
                "name",
                "city",
                "address",
                "latitude",
                "longitude",
                "phone",
                "opening_hours",
                "review_count",
                "average_rating",
            ],
            include: [
                {
                    model: Review,
                    as: "reviews",
                    separate: true,
                    limit: 5,
                    order: [["createdAt", "DESC"]],
                    attributes: [
                        "id",
                        "rating",
                        "comment",
                        "createdAt",
                    ],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "name",
                            ],
                        },
                    ],
                },
            ],
        });

        if (!branch) {
            throw createError("Branch not found", 404);
        }

        return {
            branch: branch.toJSON(),
            menus: restaurant.menus ?? [],
            reviewSummary: {
                averageRating: Number(branch.average_rating).toFixed(1),
                totalReviews: branch.review_count,
            },
        };
    },

};

