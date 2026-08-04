import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be greater than 5"),

  comment: z
    .string()
    .min(1, "Comment is required")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export const updateReviewSchema = createReviewSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    },
  );

export const branchParamsSchema = z.object({
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Invalid branch slug",
    ),
});
export const reviewBranchParamsSchema = z.object({
  branchSlug: z.string().min(1, "Invalid branch slug"),
});
export type BranchParams = z.infer<typeof branchParamsSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;