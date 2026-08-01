import { Router } from "express";
import { authRouter } from "./auth.routes";
import { restaurantRouter } from "./restaurant.routes";

const router = Router();

router.use("/auth", authRouter);

router.use("/restaurants", restaurantRouter);

export { router };
