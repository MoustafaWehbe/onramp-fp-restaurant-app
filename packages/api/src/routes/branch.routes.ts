import { Router } from "express";
import { branchController } from "../controllers/branch.controller";
import { authenticate } from "src/middleware/authenticate";
import { rateLimiter } from "src/middleware/rate-limiter";

const router = Router();

router.get(
  "/:branchId",
  authenticate,
  rateLimiter,
  branchController.getById,
);

export { router as branchRouter };