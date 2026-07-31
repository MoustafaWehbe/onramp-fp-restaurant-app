import { fn, col } from "sequelize";
import { Branch } from "../models/Branch";
import { BranchImage } from "../models/BranchImage";
import { BranchMenuItem } from "../models/BranchMenuItem";
import { MenuItem } from "../models/MenuItem";
import { Review } from "../models/Review";
import { User } from "../models/User";
import { createError } from "../middleware/error-handler";
import { validate as isUUID } from "uuid";
interface ReviewSummary {
    averageRating: string | null;
    totalReviews: string | null;
}

export class BranchService {
    async getById(branchId: string) {
        if (!isUUID(branchId)) {
        throw createError("Invalid branch id", 400);
    }
        const branch = await Branch.findByPk(branchId, {
            include: [
                {
                    model: BranchImage,
                    as: "images",
                },
                {
                    model: BranchMenuItem,
                    include: [
                        {
                            model: MenuItem,
                        },
                    ],
                },
            ],
        });

        if (!branch) {
            throw createError("Branch not found", 404);
        }

        const latestReviews = await Review.findAll({
            where: {
                branchId,
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name"],
                },
            ],
            order: [["createdAt", "DESC"]],
            limit: 3,
        });

        const reviewSummary = await Review.findOne({
            where: {
                branchId,
            },
            attributes: [
                [fn("AVG", col("rating")), "averageRating"],
                [fn("COUNT", col("id")), "totalReviews"],
            ],
            raw: true,
        }) as unknown as ReviewSummary;

        return {
            branch,
            reviewSummary: {
                averageRating: Number(
                    reviewSummary?.averageRating ?? 0,
                ).toFixed(1),

                totalReviews: Number(
                    reviewSummary?.totalReviews ?? 0,
                ),
            },
            latestReviews,
        };
    }
}
export const branchService = new BranchService();