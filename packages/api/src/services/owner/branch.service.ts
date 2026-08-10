import { Branch } from "src/models/Branch";
import { generateSlug } from "src/lib/slug";
import { createError } from "src/middleware/error-handler";
import { Menu, Restaurant, Review, User } from "@starter-kit/shared";
import { UniqueConstraintError } from "sequelize";
import { BranchImage } from "src/models/BranchImage";

interface BranchImageData {
    url: string;
    type: string;
}

interface CreateBranchData {
    restaurantId: string;
    name: string;
    city: string;
    address: string;
    latitude: string;
    longitude: string;
    phone?: string | null;
    opening_hours: string;
    images?: BranchImageData[];
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
        restaurantId,
        name,
        city,
        address,
        latitude,
        longitude,
        phone,
        opening_hours,
        images,
    }: CreateBranchData) => {
        const baseSlug = generateSlug(name);

        if (!baseSlug) {
            throw createError(
                "Branch name must contain at least one alphanumeric character",
                400,
            );
        }

        let slug = baseSlug;
        let counter = 2;

        while (true) {
            const existingBranch = await Branch.findOne({
                where: {
                    restaurantId,
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

                if (images?.length) {
                    await BranchImage.bulkCreate(
                        images.map((image) => ({
                            branchId: branch.id,
                            url: image.url,
                            type: image.type,
                        })),
                    );
                }

                const createdBranch = await Branch.findByPk(branch.id, {
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
                });

                return createdBranch;
            } catch (error) {
                if (!(error instanceof UniqueConstraintError)) {
                    throw error;
                }

                const constraint = (error.parent as {
                    constraint?: string;
                })?.constraint;

                if (constraint !== "branches_restaurant_id_slug_unique") {
                    throw error;
                }

                slug = `${baseSlug}-${counter}`;
                counter++;
            }
        }
    },

    update: async (
        restaurantId: string,
        branchId: string,
        data: UpdateBranchData,
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

        const {
            images,
            deletedImageIds,
            ...branchData
        } = data;

        await branch.update(branchData);

        if (deletedImageIds?.length) {
            await BranchImage.destroy({
                where: {
                    id: deletedImageIds,
                    branchId: branch.id,
                },
            });
        }

        if (images?.length) {
            await BranchImage.bulkCreate(
                images.map((image) => ({
                    branchId: branch.id,
                    url: image.url,
                    type: image.type,
                })),
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
        });

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

