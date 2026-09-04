import type { Request, Response, NextFunction } from "express";
import { createError } from "../../middleware/error-handler";
import { dashboardService } from "../../services/owner/dashboard.service";

type DashboardParams = {
  restaurantSlug: string;
};

export const dashboardController = {
  get: async (
    req: Request<DashboardParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { restaurantSlug } = req.params;

      if (!restaurantSlug) {
        return next(createError("Restaurant slug is required", 400));
      }

      const dashboard = await dashboardService.get(restaurantSlug);

      return res.status(200).json({
        data: dashboard,
        message: "Dashboard data retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};