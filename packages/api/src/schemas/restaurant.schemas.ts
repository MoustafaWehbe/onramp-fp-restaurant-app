import { z } from "zod";

export const restaurantParamsSchema = z.object({
    id: z.string().uuid(),
});