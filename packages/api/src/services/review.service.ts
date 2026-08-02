import { Review } from "../models/Review";
import { Branch } from "../models/Branch";
import { Restaurant } from "../models/Restaurant";
import { createError } from "../middleware/error-handler";
import { UniqueConstraintError } from "sequelize";

interface CreateReviewInput {
    userId: string;
    branchId: string;
    rating: number;
    comment: string;
}
interface UpdateReviewInput {
    rating?: number;
    comment?: string;
}

export class ReviewService {
    async create(input: CreateReviewInput) {
        const { userId, branchId, rating, comment } = input;

        const branch = await Branch.findByPk(branchId);

        if (!branch) {
            throw createError("Branch not found", 404);
        }

        const existingReview = await Review.findOne({
            where: {
                userId,
                branchId,
            },
        });

        if (existingReview) {
            throw createError(
                "You have already reviewed this branch",
                409,
            );
        }

        try {
            const review = await Review.create({
                userId,
                branchId,
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
    }
    async update(
        reviewId: string,
        userId: string,
        input: UpdateReviewInput,
    ) {
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
    }

    async delete(reviewId: string, userId: string) {
        const review = await Review.findByPk(reviewId);

        if (!review) {
            throw createError("Review not found", 404);
        }

        if (review.userId !== userId) {
            throw createError(
                "You are not authorized to delete this review",
                403,
            );
        }

        await review.destroy();
    }

    async getBranchReviews(branchId: string) {
        const branch = await Branch.findByPk(branchId);

        if (!branch) {
            throw createError("Branch not found", 404);
        }

        const reviews = await Review.findAll({
            where: {
                branchId,
            },
            order: [["createdAt", "DESC"]],
        });

        return reviews;
    }
}

export const reviewService = new ReviewService();