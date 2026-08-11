import { Router } from "express";
import { restaurantController } from "src/controllers/restaurant.controller";
import { rateLimiter } from "src/middleware/rate-limiter";
import { restaurantGetSchema, restaurantParamsSchema, restaurantQuerySchema } from "src/schemas/restaurant.schemas";
import { validate } from "src/middleware/validate";
import { authenticate } from "src/middleware/authenticate";
import { branchParamsSchema } from "src/schemas/branch.schema";
import { branchController } from "src/controllers/branch.controller";
import { opitonalAuthenticate } from "src/middleware/optionalAuthenticate";

const router = Router();

router.get(
  "/",
  opitonalAuthenticate,
  rateLimiter,
  validate(restaurantGetSchema, "query"),
  restaurantController.getRestaurants,
);

router.get(
  "/search",
  opitonalAuthenticate,
  rateLimiter,
  validate(restaurantQuerySchema, "query"),
  restaurantController.searchRestaurants,
);

router.get(
  "/:restaurantSlug/branches/:branchSlug",
  rateLimiter,
  validate(branchParamsSchema, "params"),
  branchController.getBranchBySlug,
);

router.get(
  "/:slug",
  opitonalAuthenticate,
  rateLimiter,
  validate(restaurantParamsSchema, "params"),
  restaurantController.getRestaurantBySlug,
);

export { router as restaurantRouter };