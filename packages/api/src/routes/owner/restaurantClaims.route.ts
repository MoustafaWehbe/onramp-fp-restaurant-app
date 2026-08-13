import { Router } from "express";
import { authenticate } from "src/middleware/authenticate";
import { rateLimiter } from "src/middleware/rate-limiter";
import { validate } from "src/middleware/validate";
import { restaurantClaimController } from "src/controllers/owner/restaurantClaim.controller";
import { createRestaurantClaimSchema } from "src/schemas/owner/restaurantClaim.schema";
import { authorize } from "src/middleware/authorize";

const router = Router();

router.post(
  "/",
  authenticate,
  rateLimiter,
  validate(createRestaurantClaimSchema, "body"),
  restaurantClaimController.create,
);

router.get(
    "/",
    authenticate,
    authorize("owner"),
    rateLimiter,
    restaurantClaimController.getMyClaim,
);
export { router as restaurantClaimRouter };