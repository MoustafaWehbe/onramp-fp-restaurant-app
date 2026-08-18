import { Router } from "express";
import { favoriteController } from "../controllers/favorite.controller";
import { authenticate } from "../middleware/authenticate";
import { rateLimiter } from "../middleware/rate-limiter";
import { validate } from "../middleware/validate";
import { favoriteParamsSchema } from "../schemas/favorite.schema";

const router = Router();

router.post(
    "/restaurants/:restaurantSlug/favorites",
    rateLimiter,
    authenticate,
    validate(favoriteParamsSchema, "params"),
    favoriteController.create,
);

router.delete(
    "/restaurants/:restaurantSlug/favorites",
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