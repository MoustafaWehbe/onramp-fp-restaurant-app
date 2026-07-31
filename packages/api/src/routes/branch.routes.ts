import { Router } from "express";
import { branchController } from "../controllers/branch.controller";
import { authenticate } from "../middleware/authenticate";
import { rateLimiter } from "../middleware/rate-limiter";

const router = Router();

router.get(
  "/:branchId",
  authenticate,
  rateLimiter,
  branchController.getById,
);

export { router as branchRouter };