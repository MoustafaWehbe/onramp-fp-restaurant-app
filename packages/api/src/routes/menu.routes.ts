import { Router } from "express";
import { menuController } from "../controllers/menu.controller";
import { rateLimiter } from "../middleware/rate-limiter";
import { validate } from "../middleware/validate";
import { branchMenuParamsSchema } from "../schemas/menu.schema";

const router = Router();

router.get(
    "/branches/:branchSlug/menus/:menuId",
    rateLimiter,
    validate(branchMenuParamsSchema, "params"),
    menuController.getMenuByIdForBranch,
);

export { router as menuRouter };