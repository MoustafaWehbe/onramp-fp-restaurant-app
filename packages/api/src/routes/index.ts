import { Router } from "express";
import { authRouter } from "./auth.routes";
import { restaurantRouter } from "./restaurant.routes";
import { reviewRouter } from "./review.routes";
import { favoriteRouter } from "./favorite.routes";
import { branchRouter } from "./branch.routes";
import { menuRouter } from "./menu.routes";
import { restaurantClaimRouter } from "./owner/restaurantClaims.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/", reviewRouter);
router.use("/", favoriteRouter);

router.use("/restaurants", restaurantRouter);
router.use("/branches",branchRouter);
router.use("/", menuRouter);

//Owner Routes
router.use("/owner/restaurant-claims", restaurantClaimRouter);


export { router };
