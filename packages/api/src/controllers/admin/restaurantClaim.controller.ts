import type { Request, Response, NextFunction } from "express";
import { restaurantClaimService } from "../../services/admin/restaurantClaim.service";

type GetClaimsQuery = {
    status?: "pending" | "approved" | "rejected" | "completed";
    page?: string;
    limit?: string;
};

export const restaurantClaimController = {
    getAll: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await restaurantClaimService.getAll({
                page,
                limit,
            });

            res.status(200).json({
                data: result,
                message: "Pending restaurant claims retrieved successfully",
            });
        } catch (error) {
            next(error);
        }
    },
};