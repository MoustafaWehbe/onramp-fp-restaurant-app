import { NextFunction, Request, Response } from "express";
import { restaurantService } from "../services/restaurant.service";
import { createError } from "../middleware/error-handler";

export const restaurantController = {
  getRestaurantBySlug: async (
    req: Request<{ slug: string }>,
    res: Response
  ) => {
    try {
      const { slug } = req.params;

      const userId = req.user?.userId;

      const restaurant = await restaurantService.getRestaurantBySlug(slug, userId);

      return res.status(200).json({
        data: restaurant,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Restaurant not found"
      ) {
        return res.status(404).json({
          message: error.message,
        });
      }
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to get restaurant",
      });
    }
  },

  getRestaurants: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        page,
        limit,
      } = req.query;

      const userId = req.user?.userId;

      const restaurants = await restaurantService.getRestaurants({
        page: Number(page),
        limit: Number(limit),
        userId: userId as string,
      });

      return res.status(200).json({
        ...restaurants,
        message: "Restaurants retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  searchRestaurants: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        search,
        city,
        cuisine,
        priceRange,
        page,
        limit,
      } = req.query;

      const userId = req.user?.userId;

      const restaurants = await restaurantService.searchRestaurants({
        search: search as string,
        city: city as string,
        cuisine: cuisine as string,
        priceRange: priceRange as string,
        page: Number(page),
        limit: Number(limit),
        userId: userId as string,
      });

      return res.status(200).json({
        ...restaurants,
        message: "Restaurants retrieved successfully",
      });
    } catch (error) {
      return next(error)
    }
  },
  searchByName: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.query;

      if (!name || typeof name !== "string" || !name.trim()) {
        throw createError("Restaurant name is required", 400);
      }

      const restaurants = await restaurantService.searchRestaurantsByName(
        name.trim()
      );

      return res.status(200).json({
        success: true,
        data: restaurants,
      });
    } catch (error) {
       return next(error);
    }
  },
};