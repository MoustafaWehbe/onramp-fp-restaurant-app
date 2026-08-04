import { z } from "zod";

export const favoriteParamsSchema = z.object({
    restaurantSlug: z.string().min(1, "Invalid restaurant slug"),
});