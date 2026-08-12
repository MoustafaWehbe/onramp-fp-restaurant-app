import type { Request, Response, NextFunction } from "express";
import { RestaurantClaim, User } from "@fp_restaurant/shared";
import { Op } from "sequelize";

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

    const user = await User.findByPk(userId);

    if (!user) {
      res.status(401).json({
        error: "User not found",
      });
      return;
    }

    const claim = await RestaurantClaim.findOne({
      where: {
        restaurantId,
        userId,
        status: {
          [Op.in]: ["approved", "completed"],
        }
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