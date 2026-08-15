import { z } from "zod";

export const googleMapsLocationSchema = z.object({
    url: z
        .string()
        .trim()
        .url("Please provide a valid Google Maps URL."),
});