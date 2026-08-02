import { fn, col } from "sequelize";
import { Branch } from "../models/Branch";
import { BranchImage } from "../models/BranchImage";
import { BranchMenuItem } from "../models/BranchMenuItem";
import { MenuItem } from "../models/MenuItem";
import { Review } from "../models/Review";
import { User } from "../models/User";
import { createError } from "src/middleware/error-handler";

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
                "review_count",
                "average_rating",
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
                    as: "branchMenuItems",
                    attributes: [
                        "id",
                        "branchId",
                        "menuItemId",
                    ],
                    include: [
                        {
                            model: MenuItem,
                            as: "menuItem",
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
                throw createError("Branch not found", 404);
        }
        return {
            branch,
            reviewSummary: {
                averageRating: Number(branch.average_rating).toFixed(1),
                totalReviews: branch.review_count,
            },
        };
    },
};