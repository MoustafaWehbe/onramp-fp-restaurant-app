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
    rateLimiter,
    validate(ownerBranchParamsSchema, "params"),
    verifyRestaurantOwnership,
    validate(createBranchSchema, "body"),
    branchController.create,
);

router.patch(
    "/:restaurantId/branches/:branchId",
    authenticate,
    rateLimiter,
    validate(ownerBranchUpdateParamsSchema, "params"),
    verifyRestaurantOwnership,
    validate(updateBranchSchema, "body"),
    branchController.update,
);

router.delete(
    "/:restaurantId/branches/:branchId",
    authenticate,
    rateLimiter,
    validate(ownerBranchUpdateParamsSchema, "params"),
    verifyRestaurantOwnership,
    branchController.delete,
);

router.get(
    "/:restaurantId/branches",
    authenticate,
    rateLimiter,
    validate(ownerBranchParamsSchema, "params"),
    verifyRestaurantOwnership,
    branchController.getAll,
);

router.get(
    "/:restaurantId/branches/:branchId",
    authenticate,
    rateLimiter,
    validate(ownerBranchUpdateParamsSchema, "params"),
    verifyRestaurantOwnership,
    branchController.getById,
);

export { router as ownerBranchRouter };