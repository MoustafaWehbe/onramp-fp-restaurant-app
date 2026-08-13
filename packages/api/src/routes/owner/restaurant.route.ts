import { Router } from "express";
import { authenticate } from "src/middleware/authenticate";
import { validate } from "src/middleware/validate";
import { restaurantController } from "src/controllers/owner/restaurant.controller";
import { createRestaurantSchema, updateRestaurantSchema } from "src/schemas/owner/restaurant.schema";
import { rateLimiter } from "src/middleware/rate-limiter";
import { verifyRestaurantOwnership } from "src/middleware/verifyRetsaurantOwnership";
import { authorize } from "src/middleware/authorize";

const router = Router();

router.post(
    "/",
    rateLimiter,
    authenticate,
    authorize("owner"),
    validate(createRestaurantSchema),
    restaurantController.create,
);

router.patch(
    "/:restaurantSlug",
    rateLimiter,
    authenticate,
    authorize("owner"),
    verifyRestaurantOwnership,
    validate(updateRestaurantSchema),
    restaurantController.update,
);

router.get(
    "/:restaurantSlug",
    rateLimiter,
    authenticate,
    authorize("owner"),
    verifyRestaurantOwnership,
    restaurantController.getBySlug,
);
export  {router as restaurantOwnerRouter};