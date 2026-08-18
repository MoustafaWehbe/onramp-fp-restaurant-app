import { rateLimiter } from "../middleware/rate-limiter";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { branchParamsSchema } from "../schemas/branch.schema";
import { branchController } from "../controllers/branch.controller";
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