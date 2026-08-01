import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authenticate } from "../middleware/authenticate";
import { rateLimiter } from "../middleware/rate-limiter";
import { validate } from "../middleware/validate";
import { createReviewSchema, updateReviewSchema } from "../schemas/review.schema";

const router = Router();

router.post(
    "/branches/:branchId/reviews",
    rateLimiter,
    authenticate,
    validate(createReviewSchema),
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
  "/branches/:branchId/reviews",
  authenticate,
  reviewController.getBranchReviews,
);
export { router as reviewRouter };