import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { rateLimiter } from "../../middleware/rate-limiter";
import { validate } from "../../middleware/validate";
import { verifyRestaurantOwnership } from "../../middleware/verifyRetsaurantOwnership";
import {
    ownerBranchParamsSchema,
    createBranchSchema,
    updateBranchSchema,
    ownerBranchUpdateParamsSchema,
} from "../../schemas/owner/branch.schema";
import { branchController } from "../../controllers/owner/branch.controller";
import { authorize } from "../../middleware/authorize";
import { upload } from "../../middleware/upload";
import { parseJsonFields } from "../../middleware/parse-json-fields";

const router = Router();

router.post(
    "/:restaurantSlug/branches",
    authenticate,
    authorize("owner"),
    rateLimiter,
    validate(ownerBranchParamsSchema, "params"),
    verifyRestaurantOwnership,
    upload.array("images"),
    validate(createBranchSchema, "body"),
    branchController.create,
);

router.patch(
    "/:restaurantSlug/branches/:branchSlug",
    authenticate,
    authorize("owner"),
    rateLimiter,
    validate(ownerBranchUpdateParamsSchema, "params"),
    verifyRestaurantOwnership,
    upload.array("images"),
    parseJsonFields("deletedImageIds"),
    validate(updateBranchSchema, "body"),
    branchController.update,
);

router.delete(
    "/:restaurantSlug/branches/:branchSlug",
    authenticate,
    authorize("owner"),
    rateLimiter,
    validate(ownerBranchUpdateParamsSchema, "params"),
    verifyRestaurantOwnership,
    branchController.delete,
);

router.get(
    "/:restaurantSlug/branches",
    authenticate,
    authorize("owner"),
    rateLimiter,
    validate(ownerBranchParamsSchema, "params"),
    verifyRestaurantOwnership,
    branchController.getAll,
);

router.get(
    "/:restaurantSlug/branches/:branchSlug",
    authenticate,
    authorize("owner"),
    rateLimiter,
    validate(ownerBranchUpdateParamsSchema, "params"),
    verifyRestaurantOwnership,
    branchController.getBySlug,
);

export { router as ownerBranchRouter };