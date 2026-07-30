import { Review } from "../models/Review";
import { Branch } from "../models/Branch";
import { createError } from "../middleware/error-handler";
import { UniqueConstraintError } from "sequelize";

interface CreateReviewInput {
    userId: string;
    branchId: string;
    rating: number;
    comment: string;
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
}

export const reviewService = new ReviewService();