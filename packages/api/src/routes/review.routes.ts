import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authenticate } from "../middleware/authenticate";
import { rateLimiter } from "../middleware/rate-limiter";
import { validate } from "../middleware/validate";
import { createReviewSchema, reviewBranchParamsSchema, updateReviewSchema } from "../schemas/review.schema";

const router = Router();

router.post(
    "/restaurants/:restaurantSlug/branches/:branchSlug/reviews",
    rateLimiter,
    authenticate,
    validate(createReviewSchema),
    validate(reviewBranchParamsSchema,"params"),
    reviewController.create,
);

router.patch(
  "/reviews/:reviewId",
  authenticate,
  validate(updateReviewSchema),
  reviewController.update,
);

router.delete(
  "/reviews/:reviewId",
  authenticate,
  reviewController.delete,
);

router.get(
  "/restaurants/:restaurantSlug/branches/:branchSlug/reviews",
  authenticate,
  validate(reviewBranchParamsSchema,"params"),
  reviewController.getBranchReviews,
);
export { router as reviewRouter };