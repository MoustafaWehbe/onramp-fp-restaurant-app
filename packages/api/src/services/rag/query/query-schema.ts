import { z } from "zod";

export const retrievalTypeSchema = z.enum([
  "database",
  "semantic",
  "hybrid",
]);

export const priceRangeSchema = z.enum([
  "Budget",
  "Average",
  "Expensive",
  "Luxury",
]);

export const retrievalFiltersSchema = z.object({
  city: z.string().trim().min(1).optional(),
  cuisine: z.string().trim().min(1).optional(),
  price: priceRangeSchema.optional(),

  minRating: z
    .number()
    .min(0)
    .max(5)
    .optional(),

  maxRating: z
    .number()
    .min(0)
    .max(5)
    .optional(),

  isOpenNow: z.boolean().optional(),
});

export const retrievalPlanSchema = z
  .object({
    query: z.string().trim().min(1),

    retrievalType: retrievalTypeSchema,

    filters: retrievalFiltersSchema,

    semanticQuery: z
      .string()
      .trim()
      .min(1)
      .optional(),
  })
  .superRefine((plan, ctx) => {
    if (
      (plan.retrievalType === "semantic" ||
        plan.retrievalType === "hybrid") &&
      !plan.semanticQuery
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["semanticQuery"],
        message:
          "semanticQuery is required for semantic and hybrid retrieval",
      });
    }

    if (
      plan.filters.minRating !== undefined &&
      plan.filters.maxRating !== undefined &&
      plan.filters.minRating > plan.filters.maxRating
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["filters"],
        message:
          "minRating cannot be greater than maxRating",
      });
    }
  });

export type ValidatedRetrievalPlan = z.infer<
  typeof retrievalPlanSchema
>;