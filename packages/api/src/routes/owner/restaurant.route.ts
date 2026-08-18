import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { restaurantController } from "../../controllers/owner/restaurant.controller";
import { createRestaurantSchema, updateRestaurantSchema } from "../../schemas/owner/restaurant.schema";
import { rateLimiter } from "../../middleware/rate-limiter";
import { verifyRestaurantOwnership } from "../../middleware/verifyRetsaurantOwnership";
import { authorize } from "../../middleware/authorize";
import { upload } from "../../middleware/upload";
import { parseJsonFields } from "../../middleware/parse-json-fields";

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