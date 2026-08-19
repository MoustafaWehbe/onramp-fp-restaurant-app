import { Router } from "express";
import { authorize } from "../../middleware/authorize";
import { restaurantClaimController } from "../../controllers/admin/restaurantClaim.controller";
import { authenticate } from "../../middleware/authenticate";
import { rateLimiter } from "../../middleware/rate-limiter";

const router = Router();

router.get(
  "/restaurant-claims",
  authenticate,
  authorize("admin"),
  rateLimiter,
  restaurantClaimController.getAll,
);
export { router as adminRestaurantClaim };