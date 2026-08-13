import { Router } from "express";

import { menuController } from "../../controllers/owner/menu.controller";
import { validate } from "src/middleware/validate";
import {
  createMenuSchema,
  overrideBranchMenuItemSchema,
  getRestaurantMenusSchema,
  getBranchMenusSchema,
  deleteMenuSchema,
  updateMenuSchema,
  updateMenuItemSchema,
  createMenuItemRouteSchema,
} from "../../schemas/owner/menu.schema";
import { authenticate } from "src/middleware/authenticate";
import { authorize } from "src/middleware/authorize";
import { verifyRestaurantOwnership } from "src/middleware/verifyRetsaurantOwnership";

const router = Router({ mergeParams: true });

router.post(
  "/menus",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(createMenuSchema),
  menuController.create,
);

router.get(
  "/menus",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(getRestaurantMenusSchema),
  menuController.getRestaurantMenus,
);

router.get(
  "/branches/:branchSlug/menus",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(getBranchMenusSchema),
  menuController.getBranchMenus,
);

router.patch(
  "/branches/:branchSlug/menu-items/:menuItemId",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(overrideBranchMenuItemSchema),
  menuController.overrideBranchMenuItem,
);

router.patch(
  "/menus/:menuId",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(updateMenuSchema),
  menuController.updateMenu,
);

router.delete(
  "/menus/:menuId",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(deleteMenuSchema),
  menuController.delete,
);

router.patch(
  "/menus/:menuId/:menuItemId",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(updateMenuItemSchema),
  menuController.updateMenuItem,
);

router.post(
  "/menus/:menuId",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(createMenuItemRouteSchema),
)

export {router as ownerMenuRouter};
