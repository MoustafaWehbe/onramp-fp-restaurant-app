import { Router } from "express";

import { ragController } from "../controllers/rag.controller";

import { authenticate } from "../middleware/authenticate";
import { rateLimiter } from "../middleware/rate-limiter";
import { validate } from "../middleware/validate";

import { askQuestionSchema } from "../schemas/rag.schema";

const router = Router();

router.post(
  "/ask",
  authenticate,
  rateLimiter,
  validate(askQuestionSchema, "body"),
  ragController.askQuestion,
);

export { router as ragRouter };