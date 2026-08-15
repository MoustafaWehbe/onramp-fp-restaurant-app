import { Branch } from "src/models/Branch";
import { generateSlug } from "src/lib/slug";
import { createError } from "src/middleware/error-handler";
import {
    Menu,
    Restaurant,
    Review,
    User,
} from "@starter-kit/shared";
import { UniqueConstraintError } from "sequelize";
import { BranchImage } from "src/models/BranchImage";
import { getDatabase } from "src/lib/db";

interface BranchImageData {
    url: string;
    type: string;
}

interface CreateBranchData {
    restaurantSlug: string;
    name: string;
    city: string;
    address: string;
    latitude: string;
    longitude: string;
    phone?: string | null;
    opening_hours: string;
    images: BranchImageData[];
}

interface UpdateBranchData {
    name?: string;
    city?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
    phone?: string | null;
    opening_hours?: string;
    images?: BranchImageData[];
    deletedImageIds?: string[];
}

export const branchService = {
    create: async ({
        restaurantSlug,
        name,
        city,
        address,
        latitude,
        longitude,
        phone,
        opening_hours,
        images,
    }: CreateBranchData) => {
        const restaurant = await Restaurant.findOne({
            where: {
                slug: restaurantSlug,
            },
        });

        if (!restaurant) {
            throw createError(
                "Restaurant not found",
                404,
            );
        }

        const slug = generateSlug(name);

        if (!slug) {
            throw createError(
                "Branch name must contain at least one alphanumeric character",
                400,
            );
        }

        const existingBranch = await Branch.findOne({
            where: {
                restaurantId: restaurant.id,
                slug,
            },
        });

        if (existingBranch) {
            throw createError(
                "A branch with this name already exists in this restaurant",
                409,
            );
        }

        try {
            const branch = await getDatabase().transaction(
                async (transaction) => {
                    const created = await Branch.create(
                        {
                            restaurantId: restaurant.id,
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
                        },
                        { transaction },
                    );

                    await BranchImage.bulkCreate(
                        images.map((image) => ({
                            branchId: created.id,
                            url: image.url,
                            type: image.type,
                        })),
                        { transaction },
                    );

                    await created.reload({
                        include: [
                            {
                                model: BranchImage,
                                as: "images",
                                attributes: [
                                    "id",
                                    "url",
                                    "type",
                                ],
                            },
                        ],
                        transaction,
                    });

                    return created;
                },
            );

            return branch;
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                const constraint = (
                    error.parent as {
                        constraint?: string;
                    }
                )?.constraint;

                if (
                    constraint ===
                    "branches_restaurant_id_slug_unique"
                ) {
                    throw createError(
                        "A branch with this name already exists in this restaurant",
                        409,
                    );
                }
            }

            throw error;
        }
    },

    update: async (
        restaurantSlug: string,
        branchSlug: string,
        data: UpdateBranchData,
    ) => {
        const restaurant = await Restaurant.findOne({
            where: {
                slug: restaurantSlug,
            },
        });

        if (!restaurant) {
            throw createError(
                "Restaurant not found",
                404,
            );
        }

        const branch = await Branch.findOne({
            where: {
                restaurantId: restaurant.id,
                slug: branchSlug,
            },
        });

        if (!branch) {
            throw createError(
                "Branch not found",
                404,
            );
        }

        const {
            images,
            deletedImageIds,
            ...branchData
        } = data;

        const updateData: Record<string, unknown> = {
            ...branchData,
        };

        if (
            branchData.name &&
            branchData.name !== branch.name
        ) {
            const newSlug = generateSlug(branchData.name);

            if (!newSlug) {
                throw createError(
                    "Branch name must contain at least one alphanumeric character",
                    400,
                );
            }

            const existingBranch = await Branch.findOne({
                where: {
                    restaurantId: restaurant.id,
                    slug: newSlug,
                },
            });

            if (
                existingBranch &&
                existingBranch.id !== branch.id
            ) {
                throw createError(
                    "A branch with this name already exists in this restaurant",
                    409,
                );
            }

            updateData.slug = newSlug;
        }

        try {
            await getDatabase().transaction(
                async (transaction) => {
                    await branch.update(
                        updateData,
                        { transaction },
                    );

                    if (deletedImageIds?.length) {
                        await BranchImage.destroy({
                            where: {
                                id: deletedImageIds,
                                branchId: branch.id,
                            },
                            transaction,
                        });
                    }

                    if (images?.length) {
                        await BranchImage.bulkCreate(
                            images.map((image) => ({
                                branchId: branch.id,
                                url: image.url,
                                type: image.type,
                            })),
                            { transaction },
                        );
                    }

                    await branch.reload({
                        include: [
                            {
                                model: BranchImage,
                                as: "images",
                                attributes: [
                                    "id",
                                    "url",
                                    "type",
                                ],
                            },
                        ],
                        transaction,
                    });
                },
            );

            return branch;
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                const constraint = (
                    error.parent as {
                        constraint?: string;
                    }
                )?.constraint;

                if (
                    constraint ===
                    "branches_restaurant_id_slug_unique"
                ) {
                    throw createError(
                        "A branch with this name already exists in this restaurant",
                        409,
                    );
                }
            }

            throw error;
        }
    },

    delete: async (
        restaurantSlug: string,
        branchSlug: string,
    ) => {
        const restaurant = await Restaurant.findOne({
            where: {
                slug: restaurantSlug,
            },
        });

        if (!restaurant) {
            throw createError(
                "Restaurant not found",
                404,
            );
        }

        const branch = await Branch.findOne({
            where: {
                restaurantId: restaurant.id,
                slug: branchSlug,
            },
        });

        if (!branch) {
            throw createError(
                "Branch not found",
                404,
            );
        }

        await branch.destroy();
    },

    getAll: async (restaurantSlug: string) => {
        const restaurant = await Restaurant.findOne({
            where: {
                slug: restaurantSlug,
            },
        });

        if (!restaurant) {
            throw createError(
                "Restaurant not found",
                404,
            );
        }

        const branches = await Branch.findAll({
            where: {
                restaurantId: restaurant.id,
            },
            include: [
                {
                    model: BranchImage,
                    as: "images",
                    attributes: ["id","branchId", "url", "type"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return branches;
    },

    getBySlug: async (
        restaurantSlug: string,
        branchSlug: string,
    ) => {
        const restaurant = await Restaurant.findOne({
            where: {
                slug: restaurantSlug,
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
            throw createError(
                "Restaurant not found",
                404,
            );
        }

        const branch = await Branch.findOne({
            where: {
                restaurantId: restaurant.id,
                slug: branchSlug,
            },
            attributes: [
                "id",
                "restaurantId",
                "name",
                "slug",
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
                    model: BranchImage,
                    as: "images",
                    attributes: [
                        "id",
                        "branchId",
                        "url",
                        "type",
                    ],
                },
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
            throw createError(
                "Branch not found",
                404,
            );
        }

        return {
            branch: branch.toJSON(),
            menus: restaurant.menus ?? [],
            reviewSummary: {
                averageRating: Number(
                    branch.average_rating,
                ).toFixed(1),
                totalReviews: branch.review_count,
            },
        };
    },
};