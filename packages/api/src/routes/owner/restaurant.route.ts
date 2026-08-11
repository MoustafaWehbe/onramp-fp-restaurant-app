import { Router } from "express";
import { authenticate } from "src/middleware/authenticate";
import { validate } from "src/middleware/validate";
import { restaurantController } from "src/controllers/owner/restaurant.controller";
import { createRestaurantSchema, updateRestaurantSchema } from "src/schemas/owner/restaurant.schema";
import { rateLimiter } from "src/middleware/rate-limiter";
import { verifyRestaurantOwnership } from "src/middleware/verifyRetsaurantOwnership";

const router = Router();

router.post(
    "/",
    rateLimiter,
    authenticate,
    validate(createRestaurantSchema),
    restaurantController.create,
);

router.patch(
    "/:restaurantId",
    rateLimiter,
    authenticate,
    verifyRestaurantOwnership,
    validate(updateRestaurantSchema),
    restaurantController.update,
);

router.get(
    "/:restaurantId",
    rateLimiter,
    authenticate,
    verifyRestaurantOwnership,
    restaurantController.getById,
);
export  {router as restaurantOwnerRouter};