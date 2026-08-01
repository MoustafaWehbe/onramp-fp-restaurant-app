import { Router } from "express";
import { authRouter } from "./auth.routes";
import { restaurantRouter } from "./restaurant.routes";
import { reviewRouter } from "./review.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/", reviewRouter);

router.use("/restaurants", restaurantRouter);

export { router };
