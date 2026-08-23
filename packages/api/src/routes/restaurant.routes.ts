import { Router } from "express";
import { restaurantController } from "../controllers/restaurant.controller";
import { rateLimiter } from "../middleware/rate-limiter";
import { restaurantGetSchema, restaurantParamsSchema, restaurantQuerySchema } from "../schemas/restaurant.schemas";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { branchParamsSchema } from "../schemas/branch.schema";
import { branchController } from "../controllers/branch.controller";
import { opitonalAuthenticate } from "../middleware/optionalAuthenticate";

const router = Router();

router.get(
  "/",
  rateLimiter,
  validate(restaurantGetSchema, "query"),
  restaurantController.getRestaurants,
);

router.get(
  "/cities",
  rateLimiter,
  restaurantController.getCities,
);

router.get(
  "/cuisines",
  rateLimiter,
  restaurantController.getCuisineTypes,
);

router.get(
  "/search",
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
  "/by-name",
  rateLimiter,
  restaurantController.searchByName
);

router.get(
  "/:slug",
  rateLimiter,
  validate(restaurantParamsSchema, "params"),
  restaurantController.getRestaurantBySlug,
);

export { router as restaurantRouter };