import { UniqueConstraintError } from "sequelize";
import { createError } from "../middleware/error-handler";
import { Branch } from "../models/Branch";
import { Review } from "../models/Review";
import { Restaurant } from "../models/Restaurant";
import { getDatabase } from "../lib/db";
import { reviewStatsService } from "./reviewStats.service";

interface CreateReviewInput {
    userId: string;
    restaurantSlug: string;
    branchSlug: string;
    rating: number;
    comment: string;
}

interface UpdateReviewInput {
    rating?: number;
    comment?: string;
}

export const reviewService = {
    create: async (input: CreateReviewInput) => {
        const {
            userId,
            restaurantSlug,
            branchSlug,
            rating,
            comment,
        } = input;

        const branch = await Branch.findOne({
            where: {
                slug: branchSlug,
            },
            include: [
                {
                    model: Restaurant,
                    as: "restaurant",
                    where: {
                        slug: restaurantSlug,
                    },
                },
            ],
        });

        if (!branch) {
            throw createError("Branch not found", 404);
        }

        const existingReview = await Review.findOne({
            where: {
                userId,
                branchId: branch.id,
            },
            paranoid: false,
        });

        if (existingReview) {
            if (existingReview.deletedAt) {
                return await getDatabase().transaction(async (transaction) => {
                    await existingReview.restore({ transaction });

                    await existingReview.update(
                        {
                            rating,
                            comment,
                        },
                        { transaction },
                    );

                    await reviewStatsService.recalculate(
                        branch.id,
                        transaction,
                    );

                    return existingReview;
                });
            }

            throw createError(
                "You have already reviewed this branch",
                409,
            );
        }

        try {
            return await getDatabase().transaction(async (transaction) => {
                const review = await Review.create(
                    {
                        userId,
                        branchId: branch.id,
                        rating,
                        comment,
                    },
                    { transaction },
                );

                await reviewStatsService.recalculate(
                    branch.id,
                    transaction,
                );

                return review;
            });
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw createError(
                    "You have already reviewed this branch",
                    409,
                );
            }

            throw error;
        }
    },

    update: async (
        reviewId: string,
        userId: string,
        input: UpdateReviewInput,
    ) => {
        const review = await Review.findByPk(reviewId);

        if (!review) {
            throw createError("Review not found", 404);
        }

        if (review.userId !== userId) {
            throw createError(
                "You are not authorized to update this review",
                403,
            );
        }

        return await getDatabase().transaction(async (transaction) => {
            await review.update(input, { transaction });

            await reviewStatsService.recalculate(
                review.branchId,
                transaction,
            );

            return review;
        });
    },

    delete: async (reviewId: string, userId: string) => {
        const review = await Review.findByPk(reviewId, {
            paranoid: false,
        });

        if (!review) {
            throw createError("Review not found", 404);
        }

        if (review.userId !== userId) {
            throw createError(
                "You are not authorized to delete this review",
                403,
            );
        }

        return await getDatabase().transaction(async (transaction) => {
            await review.destroy({ transaction });

            await reviewStatsService.recalculate(
                review.branchId,
                transaction,
            );

            return review;
        });
    },

    getBranchReviews: async (restaurantSlug: string, branchSlug: string) => {
        const branch = await Branch.findOne({
            where: {
                slug: branchSlug,
            },
            include: [
                {
                    model: Restaurant,
                    as: "restaurant",
                    where: {
                        slug: restaurantSlug,
                    },
                },
            ],
        });

        if (!branch) {
            throw createError("Branch not found", 404);
        }

        const reviews = await Review.findAll({
            where: {
                branchId: branch.id,
            },
            order: [["createdAt", "DESC"]],
        });

        return reviews;
    },
};