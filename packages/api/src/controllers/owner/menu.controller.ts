import type { Request, Response, NextFunction } from "express";
import { menuService } from "../../services/owner/menu.service";
import { UploadableFile } from "../../services/storage/storage.service";

export const menuController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { restaurantSlug } = req.params;

      const files = (req.files ?? []) as Express.Multer.File[];

      const items = (req.body.items ?? []).map((item: any) => {
        const { imageIndex, ...menuItem } = item;

        return {
          ...menuItem,
          image: toUploadableFile(
            imageIndex !== undefined ? files[Number(imageIndex)] : undefined,
          ),
        };
      });

      const menu = await menuService.create({
        restaurantSlug,
        ...req.body,
        items,
      });

      return res.status(201).json(menu);
    } catch (error) {
        return next(error);
    }
  },

  overrideBranchMenuItem: async (
    req: Request,
    res: Response,
    next: NextFunction,
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
      return next(error);
    }
  },

  getRestaurantMenus: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { restaurantSlug } = req.params;

      const menus = await menuService.getRestaurantMenus(
        restaurantSlug as string,
      );

      return res.status(200).json(menus);
    } catch (error) {
      return next(error);
    }
  },

  getBranchMenus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { restaurantSlug, branchSlug } = req.params;

      const menus = await menuService.getBranchMenus(
        restaurantSlug as string,
        branchSlug as string,
      );

      return res.status(200).json(menus);
    } catch (error) {
      return next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { restaurantSlug, menuId } = req.params;

      const result = await menuService.delete(
        restaurantSlug as string,
        menuId as string,
      );

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  updateMenu: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { restaurantSlug, menuId } = req.params;

      const menu = await menuService.updateMenu(
        restaurantSlug as string,
        menuId as string,
        req.body,
      );

      return res.status(200).json(menu);
    } catch (error) {
      return next(error);
    }
  },

  addMenuItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { restaurantSlug, menuId } = req.params;

      const menuItem = await menuService.addMenuItem(
        restaurantSlug as string,
        menuId as string,
        {
          ...req.body,
          image: toUploadableFile(req.file),
        },
      );

      return res.status(201).json(menuItem);
    } catch (error) {
      return next(error);
    }
  },

  updateMenuItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { restaurantSlug, menuId, menuItemId } = req.params;

      const menuItem = await menuService.updateMenuItem(
        restaurantSlug as string,
        menuId as string,
        menuItemId as string,
        {
          ...req.body,
          image: toUploadableFile(req.file),
        },
      );

      return res.status(200).json(menuItem);
    } catch (error) {
      return next(error);
    }
  },
};

const toUploadableFile = (
  file?: Express.Multer.File,
): UploadableFile | undefined => {
  if (!file) return undefined;

  return {
    originalname: file.originalname,
    mimetype: file.mimetype,
    buffer: file.buffer,
  };
};
