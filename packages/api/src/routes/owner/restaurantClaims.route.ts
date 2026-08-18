import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { rateLimiter } from "../../middleware/rate-limiter";
import { validate } from "../../middleware/validate";
import { restaurantClaimController } from "../../controllers/owner/restaurantClaim.controller";
import { createRestaurantClaimSchema } from "../../schemas/owner/restaurantClaim.schema";
import { authorize } from "../../middleware/authorize";

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