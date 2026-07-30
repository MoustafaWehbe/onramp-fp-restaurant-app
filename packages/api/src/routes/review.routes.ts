import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authenticate } from "../middleware/authenticate";
import { rateLimiter } from "../middleware/rate-limiter";
import { validate } from "../middleware/validate";
import { createReviewSchema } from "../schemas/review.schema";

const router = Router();

router.post(
    "/branches/:branchId/reviews",
    rateLimiter,
    authenticate,
    validate(createReviewSchema),
    reviewController.create,
);

export { router as reviewRouter };