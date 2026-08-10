import { z } from "zod";

export const branchMenuParamsSchema = z.object({
    branchSlug: z.string().trim().min(1),
    menuId: z.string().uuid(),
});