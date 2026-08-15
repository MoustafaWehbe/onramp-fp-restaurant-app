import { Router } from "express";
import { authRouter } from "./auth.routes";
import { restaurantRouter } from "./restaurant.routes";
import { reviewRouter } from "./review.routes";
import { favoriteRouter } from "./favorite.routes";
import { branchRouter } from "./branch.routes";
import { menuRouter } from "./menu.routes";
import { restaurantClaimRouter } from "./owner/restaurantClaims.route";
import { ownerBranchRouter } from "./owner/branch.route";
import { restaurantOwnerRouter } from "./owner/restaurant.route";
import { ownerMenuRouter } from "./owner/menu.route";
import { ownerLocationRouter } from "./owner/location.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/", reviewRouter);
router.use("/", favoriteRouter);

router.use("/restaurants", restaurantRouter);
router.use("/branches",branchRouter);
router.use("/", menuRouter);

//Owner Routes
router.use("/restaurant-claims", restaurantClaimRouter);
router.use("/owner/restaurants",ownerBranchRouter);
router.use("/owner/restaurants", restaurantOwnerRouter);
router.use("/owner/restaurants/:restaurantSlug", ownerMenuRouter);
router.use("/owner", ownerLocationRouter);
export { router };
