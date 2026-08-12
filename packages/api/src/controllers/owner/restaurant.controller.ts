import type { Request, Response, NextFunction } from "express";
import { createError } from "src/middleware/error-handler";
import { restaurantService } from "src/services/owner/restaurant.service";

export const restaurantController = {
    create: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return next(createError("Unauthenticated", 401));
            }

            const {
                image_url,
                description,
                cuisine_type,
                ambiance_tags,
                price_range,
            } = req.body;

            const restaurant = await restaurantService.create({
                userId,
                image_url,
                description,
                cuisine_type,
                ambiance_tags,
                price_range,
            });

            res.status(201).json({
                data: restaurant,
                message: "Restaurant created successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    update: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { restaurantId } = req.params;

            if (!restaurantId || Array.isArray(restaurantId)) {
                return next(
                    createError(
                        "Restaurant ID is required",
                        400,
                    ),
                );
            }

            const restaurant =
                await restaurantService.update(
                    restaurantId,
                    req.body,
                );

            res.status(200).json({
                data: restaurant,
                message: "Restaurant updated successfully",
            });
        } catch (error) {
            next(error);
        }
    },

    getById: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { restaurantId } = req.params;

            if (
                !restaurantId ||
                Array.isArray(restaurantId)
            ) {
                return next(
                    createError(
                        "Restaurant ID is required",
                        400,
                    ),
                );
            }

            const restaurant =
                await restaurantService.getById(
                    restaurantId,
                );

            res.status(200).json({
                data: restaurant,
            });
        } catch (error) {
            next(error);
        }
    },
};