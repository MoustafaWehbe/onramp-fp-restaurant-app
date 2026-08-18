import { Router } from "express";
import { menuController } from "../../controllers/owner/menu.controller";
import { validate } from "../../middleware/validate";
import {
  createMenuParamsSchema,
  createMenuBodySchema,
  overrideBranchMenuItemParamsSchema,
  overrideBranchMenuItemBodySchema,
  getRestaurantMenusSchema,
  getBranchMenusSchema,
  deleteMenuSchema,
  updateMenuParamsSchema,
  updateMenuBodySchema,
  updateMenuItemParamsSchema,
  updateMenuItemBodySchema,
  createMenuItemParamsSchema,
  createMenuItemBodySchema,
} from "../../schemas/owner/menu.schema";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { verifyRestaurantOwnership } from "../../middleware/verifyRetsaurantOwnership";
import { upload } from "../../middleware/upload";
import { parseJsonFields } from "../../middleware/parse-json-fields";

const router = Router({ mergeParams: true });

router.post(
  "/menus",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  upload.array("image"),
  parseJsonFields("items"),
  validate(createMenuParamsSchema, "params"),
  validate(createMenuBodySchema, "body"),
  menuController.create,
);

router.get(
  "/menus",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(getRestaurantMenusSchema, "params"),
  menuController.getRestaurantMenus,
);

router.get(
  "/branches/:branchSlug/menus",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(getBranchMenusSchema, "params"),
  menuController.getBranchMenus,
);

router.patch(
  "/branches/:branchSlug/menu-items/:menuItemId",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(overrideBranchMenuItemParamsSchema, "params"),
  validate(overrideBranchMenuItemBodySchema, "body"),
  menuController.overrideBranchMenuItem,
);

router.patch(
  "/menus/:menuId",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(updateMenuParamsSchema, "params"),
  validate(updateMenuBodySchema, "body"),
  menuController.updateMenu,
);

router.delete(
  "/menus/:menuId",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  validate(deleteMenuSchema, "params"),
  menuController.delete,
);

router.patch(
  "/menus/:menuId/menu-items/:menuItemId",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  upload.single("image"),
  validate(updateMenuItemParamsSchema, "params"),
  validate(updateMenuItemBodySchema, "body"),
  menuController.updateMenuItem,
);

router.post(
  "/menus/:menuId",
  authenticate,
  authorize("owner"),
  verifyRestaurantOwnership,
  upload.single("image"),
  validate(createMenuItemParamsSchema, "params"),
  validate(createMenuItemBodySchema, "body"),
  menuController.addMenuItem,
);

export { router as ownerMenuRouter };
