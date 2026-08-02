import { Router } from "express";
import { authRouter } from "./auth.routes";
import { reviewRouter } from "./review.routes";
import { favoriteRouter } from "./favorite.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/", reviewRouter);
router.use("/", favoriteRouter);

export { router };
