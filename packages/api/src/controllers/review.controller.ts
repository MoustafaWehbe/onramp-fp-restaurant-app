import type { Request, Response, NextFunction } from "express";
import { reviewService } from "../services/review.service";

export const reviewController = {
  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { branchId } = req.params;

      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const review = await reviewService.create({
        userId,
        branchId,
        ...req.body,
      });

      res.status(201).json({
        data: review,
      });
    } catch (err) {
      next(err);
    }
  },
};