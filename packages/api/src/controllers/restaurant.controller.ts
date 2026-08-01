import { Request, Response } from "express";
import { restaurantService } from "../services/restaurant.service";

export const restaurantController = {
  getRestaurantById: async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const restaurant = await restaurantService.getRestaurantById(id);

      return res.status(200).json({
        data: restaurant,
      });
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to get restaurant",
      });
    }
  },
};