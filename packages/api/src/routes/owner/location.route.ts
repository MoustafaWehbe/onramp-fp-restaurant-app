import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { rateLimiter } from "../../middleware/rate-limiter";
import { validate } from "../../middleware/validate";
import { verifyRestaurantOwnership } from "../../middleware/verifyRetsaurantOwnership";

import { googleMapsLocationSchema } from "../../schemas/owner/location.schema";
import { locationController } from "../../controllers/owner/location.controller";

const router = Router();

router.post(
    "/restaurants/:restaurantSlug/google-maps",
    authenticate,
    authorize("owner"),
    verifyRestaurantOwnership,
    rateLimiter,
    validate(
        googleMapsLocationSchema,
        "body",
    ),
    locationController.resolveGoogleMaps,
);

export { router as ownerLocationRouter };