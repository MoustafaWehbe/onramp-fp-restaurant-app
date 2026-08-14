import type { Request, Response, NextFunction } from "express";
import { Restaurant } from "../models/Restaurant";
import { RestaurantClaim } from "../models/RestaurantClaim";
import { User } from "../models/User";
import { Op } from "sequelize";

export async function verifyRestaurantOwnership(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const userId = req.user?.userId;
        const { restaurantSlug } = req.params;

        if (!userId) {
            res.status(401).json({
                error: "Unauthenticated",
            });
            return;
        }

        if (!restaurantSlug || Array.isArray(restaurantSlug)) {
            res.status(400).json({
                error: "Restaurant slug is required",
            });
            return;
        }

        const user = await User.findByPk(userId);

        if (!user) {
            res.status(401).json({
                error: "User not found",
            });
            return;
        }

        const restaurant = await Restaurant.findOne({
            where: {
                slug:restaurantSlug,
            },
        });

        if (!restaurant) {
            res.status(404).json({
                error: "Restaurant not found",
            });
            return;
        }

        const claim = await RestaurantClaim.findOne({
            where: {
                restaurantId: restaurant.id,
                userId,
                status: {
                    [Op.in]: ["approved", "completed"],
                },
            },
        });

        if (!claim) {
            res.status(403).json({
                error: "You do not have permission to access this restaurant",
            });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}