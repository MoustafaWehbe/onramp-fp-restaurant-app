import { Router } from "express";
import { menuController } from "src/controllers/menu.controller";
import { authenticate } from "src/middleware/authenticate";
import { rateLimiter } from "src/middleware/rate-limiter";
import { validate } from "src/middleware/validate";
import { branchMenuParamsSchema } from "src/schemas/menu.schema";

const router = Router();

router.get(
    "/branches/:branchSlug/menus/:menuId",
    authenticate,
    rateLimiter,
    validate(branchMenuParamsSchema, "params"),
    menuController.getMenuByIdForBranch,
);

export { router as menuRouter };