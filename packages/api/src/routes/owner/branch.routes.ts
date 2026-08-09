import { Router } from "express";
import { authenticate } from "src/middleware/authenticate";
import { rateLimiter } from "src/middleware/rate-limiter";
import { validate } from "src/middleware/validate";
import { verifyRestaurantOwnership } from "src/middleware/verifyRestaurantOwnership";
import {
    ownerBranchParamsSchema,
    createBranchSchema,
    updateBranchSchema,
    ownerBranchUpdateParamsSchema,
} from "src/schemas/owner/branch.schema";
import { branchController } from "src/controllers/owner/branch.controller";

const router = Router();

router.post(
    "/:restaurantId/branches",
    authenticate,
    verifyRestaurantOwnership,
    rateLimiter,
    validate(ownerBranchParamsSchema, "params"),
    validate(createBranchSchema, "body"),
    branchController.create,
);

router.patch(
    "/:restaurantId/branches/:branchId",
    authenticate,
    validate(ownerBranchUpdateParamsSchema, "params"),
    verifyRestaurantOwnership,
    rateLimiter,
    validate(updateBranchSchema, "body"),
    branchController.update,
);

router.delete(
    "/:restaurantId/branches/:branchId",
    authenticate,
    validate(ownerBranchUpdateParamsSchema, "params"),
    verifyRestaurantOwnership,
    rateLimiter,
    branchController.delete,
);

router.get(
    "/:restaurantId/branches",
    authenticate,
    validate(ownerBranchParamsSchema, "params"),
    verifyRestaurantOwnership,
    rateLimiter,
    branchController.getAll,
);

router.get(
    "/:restaurantId/branches/:branchId",
    authenticate,
    validate(ownerBranchUpdateParamsSchema, "params"),
    verifyRestaurantOwnership,
    rateLimiter,
    branchController.getById,
);

export { router as ownerBranchRouter };