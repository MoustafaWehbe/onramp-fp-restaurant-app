import { Router } from "express";
import { favoriteController } from "src/controllers/favorite.controller";
import { authenticate } from "src/middleware/authenticate";
import { rateLimiter } from "src/middleware/rate-limiter";
import { validate } from "src/middleware/validate";
import { favoriteParamsSchema } from "src/schemas/favorite.schema";

const router = Router();

router.post(
    "/restaurants/:restaurantId/favorites",
    rateLimiter,
    authenticate,
    validate(favoriteParamsSchema, "params"),
    favoriteController.create,
);

router.delete(
    "/restaurants/:restaurantId/favorites",
    rateLimiter,
    authenticate,
    validate(favoriteParamsSchema, "params"),
    favoriteController.delete,
);

router.get(
    "/favorites",
    rateLimiter,
    authenticate,
    favoriteController.getFavorites,
);

export { router as favoriteRouter };