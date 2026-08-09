import type { Request, Response, NextFunction } from "express";
import { Restaurant } from "../models";

export async function verifyRestaurantOwnership(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.userId;
    const { restaurantId } = req.params;

    if (!userId) {
      res.status(401).json({ error: "Unauthenticated" });
      return;
    }

    if (typeof restaurantId !== "string" || !restaurantId) {
      res.status(400).json({ error: "Invalid restaurant ID" });
      return;
    }

    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      res.status(404).json({ error: "Restaurant not found" });
      return;
    }

    if (restaurant.ownerId !== userId) {
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