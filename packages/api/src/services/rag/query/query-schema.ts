import { z } from "zod";

export const queryAnalysisStatusSchema = z.enum([
  "relevant",
  "irrelevant",
]);

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
  // Restaurant / branch filters
  city: z.array(z.string()).optional(),
  cuisine: z.array(z.string()).optional(),
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
  ambianceTags: z.array(z.string()).optional(),
  // Menu filters
  menuName: z.string().trim().min(1).optional(),
  menuDescription: z.string().trim().min(1).optional(),

  // Menu item filters
  menuItemName: z.string().trim().min(1).optional(),
  menuItemDescription: z.string().trim().min(1).optional(),

  minItemPrice: z
    .number()
    .min(0)
    .optional(),

  maxItemPrice: z
    .number()
    .min(0)
    .optional(),
});

export const retrievalPlanSchema = z
  .object({
    status: queryAnalysisStatusSchema,

    query: z
      .string()
      .trim()
      .min(1),

    retrievalType: retrievalTypeSchema.optional(),

    filters: retrievalFiltersSchema.optional(),

    semanticQuery: z
      .string()
      .trim()
      .min(1)
      .optional(),
  })
  .superRefine((plan, ctx) => {
    if (plan.status === "irrelevant") {
      return;
    }

    if (!plan.retrievalType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["retrievalType"],
        message:
          "retrievalType is required for relevant queries",
      });
    }

    if (
      plan.retrievalType === "semantic" ||
      plan.retrievalType === "hybrid"
    ) {
      if (!plan.semanticQuery) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["semanticQuery"],
          message:
            "semanticQuery is required for semantic and hybrid retrieval",
        });
      }
    }

    const filters = plan.filters;

    if (!filters) {
      return;
    }

    if (
      filters.minRating !== undefined &&
      filters.maxRating !== undefined &&
      filters.minRating > filters.maxRating
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["filters", "minRating"],
        message:
          "minRating cannot be greater than maxRating",
      });
    }

    if (
      filters.minItemPrice !== undefined &&
      filters.maxItemPrice !== undefined &&
      filters.minItemPrice > filters.maxItemPrice
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["filters", "minItemPrice"],
        message:
          "minItemPrice cannot be greater than maxItemPrice",
      });
    }
  });

export type ValidatedRetrievalPlan = z.infer<
  typeof retrievalPlanSchema
>;