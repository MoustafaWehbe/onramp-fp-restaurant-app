import { Router } from "express";
import { authenticate } from "src/middleware/authenticate";
import { authorize } from "src/middleware/authorize";
import { rateLimiter } from "src/middleware/rate-limiter";
import { validate } from "src/middleware/validate";
import { verifyRestaurantOwnership } from "src/middleware/verifyRetsaurantOwnership";

import { googleMapsLocationSchema } from "../../schemas/owner/location.schema";
import { locationController } from "src/controllers/owner/location.controller";

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