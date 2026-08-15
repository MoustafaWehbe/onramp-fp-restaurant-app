import { Router } from "express";
import { authenticate } from "src/middleware/authenticate";
import { validate } from "src/middleware/validate";
import { restaurantController } from "src/controllers/owner/restaurant.controller";
import { createRestaurantSchema, updateRestaurantSchema } from "src/schemas/owner/restaurant.schema";
import { rateLimiter } from "src/middleware/rate-limiter";
import { verifyRestaurantOwnership } from "src/middleware/verifyRetsaurantOwnership";
import { authorize } from "src/middleware/authorize";
import { upload } from "src/middleware/upload";
import { parseJsonFields } from "src/middleware/parse-json-fields";

const router = Router();

router.post(
    "/",
    rateLimiter,
    authenticate,
    authorize("owner"),
    upload.single("image"),
    parseJsonFields("ambiance_tags"),
    validate(createRestaurantSchema),
    restaurantController.create,
);

router.patch(
    "/:restaurantSlug",
    rateLimiter,
    authenticate,
    authorize("owner"),
    verifyRestaurantOwnership,
    upload.single("image"),
    parseJsonFields("ambiance_tags"),
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