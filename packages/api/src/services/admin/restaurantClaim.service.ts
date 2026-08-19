import { RestaurantClaim } from "../../models/RestaurantClaim";
import { User } from "../../models/User";

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
};