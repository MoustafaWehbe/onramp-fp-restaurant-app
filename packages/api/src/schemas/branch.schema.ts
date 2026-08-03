import { z } from "zod";

export const branchParamsSchema = z.object({
  restaurantSlug: z.string().min(1, "Invalid restaurant slug"),
  branchSlug: z.string().min(1, "Invalid branch slug"),
});