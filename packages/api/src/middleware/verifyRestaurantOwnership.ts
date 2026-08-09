import type { Request, Response, NextFunction } from "express";
import { RestaurantClaim } from "@fp_restaurant/shared";

export async function verifyRestaurantOwnership(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    const { restaurantId } = req.params;

    if (!userId) {
      res.status(401).json({
        error: "Unauthenticated",
      });
      return;
    }

    if (!restaurantId) {
      res.status(400).json({
        error: "Restaurant ID is required",
      });
      return;
    }

    const claim = await RestaurantClaim.findOne({
      where: {
        restaurantId,
        userId,
        status: "approved",
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