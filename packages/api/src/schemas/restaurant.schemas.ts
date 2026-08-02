import { z } from "zod";

export const restaurantParamsSchema = z.object({
      slug: z.string().min(1),
});