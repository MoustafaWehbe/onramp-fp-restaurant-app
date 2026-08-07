import { NextFunction, Request, Response } from "express";
import { restaurantService } from "../services/restaurant.service";

export const restaurantController = {
  getRestaurantBySlug: async (
    req: Request<{ slug: string }>,
    res: Response
  ) => {
    try {
      const { slug } = req.params;

      const restaurant = await restaurantService.getRestaurantBySlug(slug);

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

      const restaurants = await restaurantService.getRestaurants({
        page: Number(page),
        limit: Number(limit),
      });

      return res.status(200).json({
        ...restaurants,
        message: "Restaurants retrieved successfully",
      });
    } catch(error) {
      next(error);
    }
  },

  searchRestaurants: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        search,
        city,
        cuisine,
        page,
        limit,
      } = req.query;

      const restaurants = await restaurantService.searchRestaurants({
        search: search as string,
        city: city as string,
        cuisine: cuisine as string,
        page: Number(page),
        limit: Number(limit),
      });

      return res.status(200).json({
        ...restaurants,
        message: "Restaurants retrieved successfully",
      });
    } catch(error) {
      return next(error)
    }
  }
};