import { Router } from "express";
import { authRouter } from "./auth.routes";
import { restaurantRouter } from "./restaurant.routes";
import { reviewRouter } from "./review.routes";
import { favoriteRouter } from "./favorite.routes";
import { branchRouter } from "./branch.routes";
import { menuRouter } from "./menu.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/", reviewRouter);
router.use("/", favoriteRouter);

router.use("/restaurants", restaurantRouter);
router.use("/branches",branchRouter);
router.use("/menus", menuRouter);
// Add more routers here:
// router.use('/users', usersRouter);

export { router };
