import type { Request, Response, NextFunction } from "express";
import { reviewService } from "../services/review.service";
import { branchParamsSchema } from "src/schemas/branch.schema";
import { reviewBranchParamsSchema } from "src/schemas/review.schema";

export const reviewController = {
  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { branchSlug } = reviewBranchParamsSchema.parse(req.params);

      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const review = await reviewService.create({
        userId,
        branchSlug,
        ...req.body,
      });

      res.status(201).json({
        data: review,
        message: "Review created successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const reviewId = req.params.reviewId as string;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const review = await reviewService.update(
        reviewId,
        userId,
        req.body,
      );

      res.status(200).json({
        message: "Review updated successfully.",
        data: review,
      });
    } catch (err) {
      next(err);
    }
  },

  async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const reviewId = req.params.reviewId as string;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      await reviewService.delete(reviewId, userId);

      res.status(200).json({
        message: "Review deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  async getBranchReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { branchSlug } = reviewBranchParamsSchema.parse(req.params);
      const reviews = await reviewService.getBranchReviews(branchSlug);

      res.status(200).json({
        data: reviews,
      });
    } catch (err) {
      next(err);
    }
  },
};