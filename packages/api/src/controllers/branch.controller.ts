import type { Request, Response, NextFunction } from "express";
import { branchService } from "../services/branch.service";

export const branchController = {
  async getBranchBySlug(
    req: Request<{ restaurantSlug: string; branchSlug: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { restaurantSlug, branchSlug } = req.params;

      const branch = await branchService.getBranchBySlug(
        branchSlug,
        restaurantSlug
      );

      res.status(200).json({
        message: "Branch details retrieved successfully",
        data: branch,
      });
    } catch (err) {
      next(err);
    }
  },
};