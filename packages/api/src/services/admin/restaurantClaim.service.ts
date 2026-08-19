import { getDatabase } from "../../lib/db";
import { createError } from "../../middleware/error-handler";
import { RestaurantClaim } from "../../models/RestaurantClaim";
import { User } from "../../models/User";
import { emailQueue } from "@fp_restaurant/shared";

interface GetAllClaimsParams {
    page: number;
    limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const normalizePagination = (page: number, limit: number) => {
    const validPage =
        Number.isSafeInteger(page) && page >= 1
            ? page
            : DEFAULT_PAGE;

    const validLimit =
        Number.isSafeInteger(limit) && limit >= 1
            ? Math.min(limit, MAX_LIMIT)
            : DEFAULT_LIMIT;

    return {
        page: validPage,
        limit: validLimit,
        offset: (validPage - 1) * validLimit,
    };
};

export const restaurantClaimService = {
    getAll: async ({
        page,
        limit,
    }: GetAllClaimsParams) => {
        const {
            page: normalizedPage,
            limit: normalizedLimit,
            offset,
        } = normalizePagination(page, limit);

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
            limit: normalizedLimit,
            offset,
        });

        return {
            claims: rows,
            pagination: {
                page: normalizedPage,
                limit: normalizedLimit,
                total: count,
                totalPages: Math.ceil(count / normalizedLimit),
            },
        };
    },

    rejectClaim: async (claimId: string) => {
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
                    "Only pending restaurant claims can be rejected",
                    400,
                );
            }

            await claim.update(
                {
                    status: "rejected",
                },
                {
                    transaction,
                },
            );

            await transaction.commit();

            try {
                const user = await User.findByPk(claim.userId);

                if (user) {
                    await emailQueue.add("email", {
                        type: "restaurant-claim-rejected",
                        to: user.email,
                        variables: {
                            restaurantName: claim.restaurantName,
                        },
                    });
                }
            } catch (error) {
                console.error(
                    "Failed to enqueue restaurant claim rejection email:",
                    error,
                );
            }

            return claim;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async approveClaim(claimId: string) {
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