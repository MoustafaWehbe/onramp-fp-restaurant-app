import { fn, col } from "sequelize";
import { Branch } from "../models/Branch";
import { BranchImage } from "../models/BranchImage";
import { BranchMenuItem } from "../models/BranchMenuItem";
import { MenuItem } from "../models/MenuItem";
import { Review } from "../models/Review";
import { User } from "../models/User";

export const branchService = {
    getBranchById: async (branchId: string) => {
        const branch = await Branch.findByPk(branchId, {
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
            ],
            include: [
                {
                    model: BranchImage,
                    as: "images",
                    attributes: [
                        "url",
                        "type",
                    ],
                },
                {
                    model: BranchMenuItem,
                    attributes: [],
                    include: [
                        {
                            model: MenuItem,
                            attributes: [
                                "id",
                                "name",
                                "description",
                                "base_price",
                            ],
                        },
                    ],
                },
                {
                    model: Review,
                    as: "reviews",
                    separate: true,
                    limit: 3,
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
            throw new Error("Branch not found");
        }

        const reviewSummary = await Review.findOne({
            where: {
                branchId,
            },
            attributes: [
                [fn("AVG", col("rating")), "averageRating"],
                [fn("COUNT", col("id")), "totalReviews"],
            ],
            raw: true,
        });

        return {
            branch,
            reviewSummary: {
                averageRating: Number(
                    (reviewSummary as any)?.averageRating ?? 0,
                ).toFixed(1),
                totalReviews: Number(
                    (reviewSummary as any)?.totalReviews ?? 0,
                ),
            },
        };
    },
};