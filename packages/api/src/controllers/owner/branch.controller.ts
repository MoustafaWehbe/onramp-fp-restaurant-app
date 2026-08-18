import type { Request, Response, NextFunction } from "express";
import { createError } from "../../middleware/error-handler";
import { branchService } from "../../services/owner/branch.service";

type RestaurantBranchParams = {
  restaurantSlug: string;
};

type BranchParams = {
  restaurantSlug: string;
  branchSlug: string;
};

export const branchController = {
  create: async (
    req: Request<RestaurantBranchParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { restaurantSlug } = req.params;

      if (!restaurantSlug) {
        return next(createError("Restaurant slug is required", 400));
      }

      const { name, city, address, latitude, longitude, phone, opening_hours } =
        req.body;

      const images = (req.files as Express.Multer.File[] | undefined) ?? [];

      const branch = await branchService.create({
        restaurantSlug,
        name,
        city,
        address,
        latitude,
        longitude,
        phone,
        opening_hours,
        images,
      });

      res.status(201).json({
        data: branch,
        message: "Branch created successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (
    req: Request<BranchParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { restaurantSlug, branchSlug } = req.params;

      if (!restaurantSlug || !branchSlug) {
        return next(
          createError("Restaurant slug and branch slug are required", 400),
        );
      }

      const images = req.files as Express.Multer.File[] | undefined;

      const branch = await branchService.update(restaurantSlug, branchSlug, {
        ...req.body,
        images,
      });

      res.status(200).json({
        data: branch,
        message: "Branch updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (
    req: Request<BranchParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { restaurantSlug, branchSlug } = req.params;

      if (!restaurantSlug || !branchSlug) {
        return next(
          createError("Restaurant slug and branch slug are required", 400),
        );
      }

      await branchService.delete(restaurantSlug, branchSlug);

      res.status(200).json({
        message: "Branch deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (
    req: Request<RestaurantBranchParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { restaurantSlug } = req.params;

      if (!restaurantSlug) {
        return next(createError("Restaurant slug is required", 400));
      }

      const branches = await branchService.getAll(restaurantSlug);

      res.status(200).json({
        data: branches,
        message: "Branches retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getBySlug: async (
    req: Request<BranchParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { restaurantSlug, branchSlug } = req.params;

      if (!restaurantSlug || !branchSlug) {
        return next(
          createError("Restaurant slug and branch slug are required", 400),
        );
      }

      const branch = await branchService.getBySlug(restaurantSlug, branchSlug);

      res.status(200).json({
        data: branch,
        message: "Branch retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
