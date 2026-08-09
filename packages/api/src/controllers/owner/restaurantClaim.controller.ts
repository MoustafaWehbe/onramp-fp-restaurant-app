import type { Request, Response, NextFunction } from "express";
import { restaurantClaimService } from "src/services/owner/restaurantClaim.service";

export const restaurantClaimController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return next();
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
                phone
            );

            res.status(201).json({
                data: claim,
                message: "Restaurant claim submitted successfully",
            });
        } catch (error) {
            next(error);
        }
    },
};