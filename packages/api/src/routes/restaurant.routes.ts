import { Router } from "express";
import { restaurantController } from "src/controllers/restaurant.controller";
import { rateLimiter } from "src/middleware/rate-limiter";
import { restaurantParamsSchema } from "src/schemas/restaurant.schemas";
import { validate } from "src/middleware/validate";
import { authenticate } from "src/middleware/authenticate";
import { branchParamsSchema } from "src/schemas/branch.schema";
import { branchController } from "src/controllers/branch.controller";

const router = Router();

router.get(
    "/:slug",
    rateLimiter,
    validate(restaurantParamsSchema, "params"),
    restaurantController.getRestaurantBySlug,
);
router.get(
  "/:restaurantSlug/branches/:branchSlug",
  authenticate,
  rateLimiter,
  validate(branchParamsSchema, "params"),
  branchController.getBranchBySlug,
);
export { router as restaurantRouter };