 import { z } from "zod";

export const branchIdSchema = z.object({
    branchId: z.string().uuid("Invalid branch id"),
});