import { Router } from "express";
import { authRouter } from "./auth.routes";
import { restaurantRouter } from "./restaurant.routes";
import { reviewRouter } from "./review.routes";
import { favoriteRouter } from "./favorite.routes";
import { branchRouter } from "./branch.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/", reviewRouter);
router.use("/", favoriteRouter);

router.use("/restaurants", restaurantRouter);
// Add more routers here:
// router.use('/users', usersRouter);

export { router };
