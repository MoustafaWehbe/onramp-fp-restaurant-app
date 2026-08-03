import { UniqueConstraintError } from "sequelize";
import { createError } from "../middleware/error-handler";
import { Branch } from "../models/Branch";
import { Review } from "../models/Review";

interface CreateReviewInput {
    userId: string;
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
        const { userId, branchSlug, rating, comment } = input;

        const branch = await Branch.findOne({
            where: {
                slug: branchSlug,
            },
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
            if (existingReview.toJSON()) {
                await existingReview.restore();

                await existingReview.update({
                    rating,
                    comment,
                });

                return existingReview;
            }

            throw createError(
                "You have already reviewed this branch",
                409,
            );
        }

        try {
            const review = await Review.create({
                userId,
                branchId: branch.id,
                rating,
                comment,
            });

            return review;
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

        await review.update(input);

        return review;
    },

    delete: async (reviewId: string, userId: string) => {
        const review = await Review.findByPk(reviewId);
        console.log("Before delete:", review?.toJSON());
        if (!review) {
            throw createError("Review not found", 404);
        }

        if (review.userId !== userId) {
            throw createError(
                "You are not authorized to delete this review",
                403,
            );
        }
        await review.reload({
            paranoid: false,
        });

        return review;

    },

    getBranchReviews: async (branchSlug: string) => {
        const branch = await Branch.findOne({
            where: {
                slug: branchSlug,
            },
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