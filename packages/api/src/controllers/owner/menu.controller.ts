import type { Request, Response, NextFunction } from "express";
import { menuService } from "../../services/owner/menu.service";

export const menuController = {
  create: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { restaurantSlug } = req.params;

      const menu = await menuService.create({
        restaurantSlug,
        ...req.body,
      });

      return res.status(201).json(menu);
    } catch (error) {
      next(error);
    }
  },

  overrideBranchMenuItem: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { restaurantSlug, branchSlug, menuItemId } = req.params;

      const result = await menuService.overrideBranchMenuItem({
        restaurantSlug: restaurantSlug as string,
        branchSlug: branchSlug as string,
        menuItemId: menuItemId as string,   
        customPrice: req.body.customPrice,
        isAvailable: req.body.isAvailable,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  getRestaurantMenus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { restaurantSlug } = req.params;

      const menus = await menuService.getRestaurantMenus(
        restaurantSlug as string
      );

      return res.status(200).json(menus);
    } catch (error) {
      next(error);
    }
  },

  getBranchMenus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { restaurantSlug, branchSlug } = req.params;

      const menus = await menuService.getBranchMenus(
        restaurantSlug as string,
        branchSlug as string
      );

      return res.status(200).json(menus);
    } catch (error) {
      next(error);
    }
  },

  delete: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { restaurantSlug, menuId } = req.params;

      const result = await menuService.delete(
        restaurantSlug as string,
        menuId as string
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  update: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { restaurantSlug, menuId } = req.params;

      const menu = await menuService.update(
        restaurantSlug as string,
        menuId as string,
        req.body
      );

      return res.status(200).json(menu);
    } catch (error) {
      next(error);
    }
  },
};