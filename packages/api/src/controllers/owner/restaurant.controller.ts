import type { Request, Response, NextFunction } from "express";
import { createError } from "../../middleware/error-handler";
import { restaurantService } from "../../services/owner/restaurant.service";

export const restaurantController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return next(createError("Unauthenticated", 401));
      }

      const {
        description,
        cuisine_type,
        ambiance_tags,
        price_range,
      } = req.body;

      if (!req.file) {
        return next(createError("Restaurant image is required", 400));
      }

      const restaurant = await restaurantService.create({
        userId,
        description,
        cuisine_type,
        ambiance_tags,
        price_range,
        image: req.file,
      });

      return res.status(201).json({
        data: restaurant,
        message: "Restaurant created successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { restaurantSlug } = req.params;

      if (!restaurantSlug || Array.isArray(restaurantSlug)) {
        return next(createError("Restaurant Slug is required", 400));
      }
      const restaurant = await restaurantService.update(
        restaurantSlug,
        {
          ...req.body,
          image: req.file,
        }
      );

      return res.status(200).json({
        data: restaurant,
        message: "Restaurant updated successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  getBySlug: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { restaurantSlug } = req.params;

      if (!restaurantSlug || Array.isArray(restaurantSlug)) {
        return next(createError("Restaurant slug is required", 400));
      }

      const restaurant = await restaurantService.getBySlug(restaurantSlug);

      return res.status(200).json({
        data: restaurant,
      });
    } catch (error) {
      return next(error);
    }
  },
};
