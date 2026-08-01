import { Router } from "express";
import { restaurantController } from "src/controllers/restaurant.controller";
import { rateLimiter } from "src/middleware/rate-limiter";
import { restaurantParamsSchema } from "src/schemas/restaurant.schemas";
import { validate } from "src/middleware/validate";

const router = Router();

router.get(
    "/:id",
    rateLimiter,
    validate(restaurantParamsSchema),
    restaurantController.getRestaurantById,
);

export { router as restaurantRouter };