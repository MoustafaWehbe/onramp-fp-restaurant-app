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

    reject: async (
        req: Request<{ claimId: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { claimId } = req.params;

            const result = await restaurantClaimService.rejectClaim(claimId);

            res.status(200).json({
                data: result,
                message: "Restaurant claim rejected successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    approve: async (
        req: Request<{ claimId: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { claimId } = req.params;

            const result = await restaurantClaimService.approveClaim(claimId);

            res.status(200).json({
                data: result,
                message: "Restaurant claim approved successfully",
            });
        } catch (error) {
            next(error);
        }
    },
};