import { Router } from "express";
import { menuController } from "../controllers/menu.controller";
import { authenticate } from "../middleware/authenticate";
import { rateLimiter } from "../middleware/rate-limiter";
import { validate } from "../middleware/validate";
import { branchMenuParamsSchema } from "../schemas/menu.schema";

const router = Router();

router.get(
    "/branches/:branchSlug/menus/:menuId",
    authenticate,
    rateLimiter,
    validate(branchMenuParamsSchema, "params"),
    menuController.getMenuByIdForBranch,
);

export { router as menuRouter };