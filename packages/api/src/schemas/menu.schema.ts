import { z } from "zod";

export const menuParamsSchema = z.object({
    id: z.string().uuid(),
});