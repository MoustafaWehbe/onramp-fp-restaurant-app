import { Router } from "express";
import { menuController } from "src/controllers/menu.controller";
import { rateLimiter } from "src/middleware/rate-limiter";
import { validate } from "src/middleware/validate";
import { menuParamsSchema } from "src/schemas/menu.schema";

const router = Router();

router.get(
    "/:id",
    rateLimiter,
    validate(menuParamsSchema, "params"),
    menuController.getMenuById,
);

export { router as menuRouter };