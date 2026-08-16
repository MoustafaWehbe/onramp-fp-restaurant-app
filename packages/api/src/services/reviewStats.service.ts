import { col, fn, type Transaction } from "sequelize";
import { Branch } from "../models/Branch";
import { Review } from "../models/Review";
import { Restaurant } from "../models/Restaurant";

interface ReviewStats {
    reviewCount: number;
    averageRating: number;
}

const getBranchStats = async (
    branchId: string,
    transaction?: Transaction,
): Promise<ReviewStats> => {
    const result = await Review.findOne({
        where: {
            branchId,
        },
        attributes: [
            [fn("COUNT", col("id")), "reviewCount"],
            [fn("AVG", col("rating")), "averageRating"],
        ],
        raw: true,
        transaction,
    });

    const stats = result as unknown as {
        reviewCount: string | number;
        averageRating: string | number | null;
    };

    return {
        reviewCount: Number(stats.reviewCount) || 0,
        averageRating: Number(stats.averageRating) || 0,
    };
};

const getRestaurantStats = async (
    restaurantId: string,
    transaction?: Transaction,
): Promise<ReviewStats> => {
    const result = await Review.findOne({
        include: [
            {
                model: Branch,
                as: "branch",
                attributes: [],
                where: {
                    restaurantId,
                },
                required: true,
            },
        ],
        attributes: [
            [fn("COUNT", col("Review.id")), "reviewCount"],
            [fn("AVG", col("Review.rating")), "averageRating"],
        ],
        raw: true,
        transaction,
    });

    const stats = result as unknown as {
        reviewCount: string | number;
        averageRating: string | number | null;
    };

    return {
        reviewCount: Number(stats.reviewCount) || 0,
        averageRating: Number(stats.averageRating) || 0,
    };
};

export const reviewStatsService = {
    recalculate: async (
        branchId: string,
        transaction?: Transaction,
    ): Promise<void> => {
        const branch = await Branch.findByPk(branchId, {
            transaction,
        });

        if (!branch) {
            return;
        }

        const branchStats = await getBranchStats(
            branch.id,
            transaction,
        );

        await branch.update(
            {
                review_count: branchStats.reviewCount,
                average_rating: branchStats.averageRating,
            },
            { transaction },
        );

        const restaurant = await Restaurant.findByPk(
            branch.restaurantId,
            { transaction },
        );

        if (!restaurant) {
            return;
        }

        const restaurantStats = await getRestaurantStats(
            restaurant.id,
            transaction,
        );

        await restaurant.update(
            {
                review_count: restaurantStats.reviewCount,
                average_rating: restaurantStats.averageRating,
            },
            { transaction },
        );
    },
};