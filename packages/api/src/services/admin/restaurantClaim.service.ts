import { getDatabase } from "../../lib/db";
import { createError } from "../../middleware/error-handler";
import { RestaurantClaim } from "../../models/RestaurantClaim";
import { User } from "../../models/User";
import { emailQueue } from "@fp_restaurant/shared";

interface GetAllClaimsParams {
    page: number;
    limit: number;
}

export const restaurantClaimService = {
    getAll: async ({
        page,
        limit,
    }: GetAllClaimsParams) => {
        const offset = (page - 1) * limit;

        const { rows, count } = await RestaurantClaim.findAndCountAll({
            where: {
                status: "pending",
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                },
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset,
        });

        return {
            claims: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    },

    async rejectClaim(claimId: string) {
        const claim = await RestaurantClaim.findByPk(claimId);

        if (!claim) {
            throw createError("Restaurant claim not found", 404);
        }

        if (claim.status !== "pending") {
            throw createError(
                "Only pending restaurant claims can be rejected",
                400,
            );
        }

        const user = await User.findByPk(claim.userId);

        if (!user) {
            throw createError("User associated with this claim not found", 404);
        }

        await claim.update({
            status: "rejected",
        });

        try {
            await emailQueue.add("email", {
                type: "restaurant-claim-rejected",
                to: user.email,
                variables: {
                    restaurantName: claim.restaurantName,
                },
            });
        } catch (err) {
            console.error(
                "Failed to enqueue restaurant claim rejection email:",
                err,
            );
        }

        return claim;
    },

    async approveClaim (claimId: string) {
        const transaction = await getDatabase().transaction();

        try {
            const claim = await RestaurantClaim.findByPk(claimId, {
                transaction,
                lock: transaction.LOCK.UPDATE,
            });

            if (!claim) {
                throw createError("Restaurant claim not found", 404);
            }

            if (claim.status !== "pending") {
                throw createError(
                    "Only pending restaurant claims can be approved",
                    400,
                );
            }

            const user = await User.findByPk(claim.userId, {
                transaction,
                lock: transaction.LOCK.UPDATE,
            });

            if (!user) {
                throw createError(
                    "User associated with this claim not found",
                    404,
                );
            }

            await claim.update(
                {
                    status: "approved",
                },
                {
                    transaction,
                },
            );

            await user.update(
                {
                    role: "owner",
                },
                {
                    transaction,
                },
            );

            await transaction.commit();

            try {
                await emailQueue.add("email", {
                    type: "restaurant-claim-approved",
                    to: user.email,
                    variables: {
                        restaurantName: claim.restaurantName,
                    },
                });
            } catch (error) {
                console.error(
                    "Failed to enqueue restaurant claim approval email:",
                    error,
                );
            }

            return claim;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};