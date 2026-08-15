import { z } from "zod";

export const GOOGLE_MAPS_HOSTS = new Set([
    "maps.google.com",
    "www.google.com",
    "google.com",
    "maps.app.goo.gl",
    "goo.gl",
]);

export const googleMapsLocationSchema = z.object({
    url: z
        .string()
        .trim()
        .url("Please provide a valid Google Maps URL.")
        .refine(
            (value) => {
                try {
                    const hostname = new URL(value).hostname.toLowerCase();

                    return GOOGLE_MAPS_HOSTS.has(hostname);
                } catch {
                    return false;
                }
            },
            {
                message:
                    "Please provide a valid Google Maps URL.",
            },
        ),
});