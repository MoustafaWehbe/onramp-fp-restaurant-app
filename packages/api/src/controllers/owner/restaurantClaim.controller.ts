import type { Request, Response, NextFunction } from "express";
import { createError } from "src/middleware/error-handler";
import { restaurantClaimService } from "src/services/owner/restaurantClaim.service";

export const restaurantClaimController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
               return next(
                    createError("Unauthenticated", 401),
                );
            }

            const {
                restaurantId,
                restaurantName,
                email,
                phone,
            } = req.body;

            const claim = await restaurantClaimService.create(
                userId,
                restaurantId,
                restaurantName,
                email,
                phone,
            );

            res.status(201).json({
                data: claim,
                message: "Restaurant claim submitted successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    getMyClaim: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return next(
                    createError("Unauthenticated", 401),
                );
            }

            const claim =
                await restaurantClaimService.getMyClaim(
                    userId,
                );

            res.status(200).json({
                data: claim,
            });
        } catch (error) {
            next(error);
        }
    },
};