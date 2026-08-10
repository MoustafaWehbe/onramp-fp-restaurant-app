import { Router } from "express";
import { authRouter } from "./auth.routes";
import { restaurantRouter } from "./restaurant.routes";
import { reviewRouter } from "./review.routes";
import { favoriteRouter } from "./favorite.routes";
import { branchRouter } from "./branch.routes";
import { menuRouter } from "./menu.routes";
import { restaurantClaimRouter } from "./owner/restaurantClaims.route";
import { ownerBranchRouter } from "./owner/branch.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/", reviewRouter);
router.use("/", favoriteRouter);

router.use("/restaurants", restaurantRouter);
router.use("/branches",branchRouter);
router.use("/menus", menuRouter);

//Owner Routes
router.use("/owner/restaurant-claims", restaurantClaimRouter);
router.use("/owner",ownerBranchRouter);

export { router };
