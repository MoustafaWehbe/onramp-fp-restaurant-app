import { z } from "zod";

export const favoriteParamsSchema = z.object({
    restaurantId: z.string().uuid(),
});