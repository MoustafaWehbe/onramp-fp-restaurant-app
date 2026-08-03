import { rateLimiter } from "src/middleware/rate-limiter";
import { validate } from "src/middleware/validate";
import { authenticate } from "src/middleware/authenticate";
import { branchParamsSchema } from "src/schemas/branch.schema";
import { branchController } from "src/controllers/branch.controller";
import { Router } from "express";

const router = Router();

router.get(
  "/:restaurantSlug/branches/:branchSlug",
  authenticate,
  rateLimiter,
  validate(branchParamsSchema, "params"),
  branchController.getBranchBySlug,
);
export { router as branchRouter };