import { Router } from "express";
import { authenticate } from "src/middleware/authenticate";
import { rateLimiter } from "src/middleware/rate-limiter";
import { validate } from "src/middleware/validate";
import { restaurantClaimController } from "src/controllers/owner/restaurantClaim.controller";
import { createRestaurantClaimSchema } from "src/schemas/owner/restaurantClaim.schema";

const router = Router();

router.post(
  "/",
  authenticate,
  rateLimiter,
  validate(createRestaurantClaimSchema, "body"),
  restaurantClaimController.create,
);

export { router as restaurantClaimRouter };