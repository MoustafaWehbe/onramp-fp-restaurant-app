import { Router } from "express";
import { authRouter } from "./auth.routes";
import { reviewRouter } from "./review.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/", reviewRouter);

// Add more routers here:
// router.use('/users', usersRouter);

export { router };
