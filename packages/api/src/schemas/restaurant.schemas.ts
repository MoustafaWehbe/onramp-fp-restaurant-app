import { z } from "zod";

export const restaurantParamsSchema = z.object({
      slug: z.string().min(1),
});

export const restaurantGetSchema = z.object({
  page: z.coerce.number()
    .int()
    .min(1)
    .default(1),
  
  limit: z.coerce.number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

export const restaurantQuerySchema = z.object({
  search: z.string(),
  cuisine: z.string().optional(),
  city: z.string().optional(),

  page: z.coerce.number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce.number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});