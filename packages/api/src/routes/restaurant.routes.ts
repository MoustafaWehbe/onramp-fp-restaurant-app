import { Router } from "express";
import { restaurantController } from "src/controllers/restaurant.controller";
import { rateLimiter } from "src/middleware/rate-limiter";
import { restaurantGetSchema, restaurantParamsSchema, restaurantQuerySchema } from "src/schemas/restaurant.schemas";
import { validate } from "src/middleware/validate";
import { authenticate } from "src/middleware/authenticate";
import { branchParamsSchema } from "src/schemas/branch.schema";
import { branchController } from "src/controllers/branch.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  rateLimiter,
  validate(restaurantGetSchema, "query"),
  restaurantController.getRestaurants,
);

router.get(
  "/search",
  authenticate,
  rateLimiter,
  validate(restaurantQuerySchema, "query"),
  restaurantController.searchRestaurants,
);

router.get(
  "/:restaurantSlug/branches/:branchSlug",
  authenticate,
  rateLimiter,
  validate(branchParamsSchema, "params"),
  branchController.getBranchBySlug,
);

router.get(
  "/by-name",
  authenticate,
  rateLimiter,
  restaurantController.searchByName
);

router.get(
  "/:slug",
  authenticate,
  rateLimiter,
  validate(restaurantParamsSchema, "params"),
  restaurantController.getRestaurantBySlug,
);

export { router as restaurantRouter };