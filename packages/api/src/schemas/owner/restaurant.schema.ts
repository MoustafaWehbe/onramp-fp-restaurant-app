import { z } from "zod";

export const createRestaurantSchema = z.object({
    image_url: z.string().min(1, "Image URL is required"),
    description: z.string().min(1, "Description is required"),
    cuisine_type: z.string().min(1, "Cuisine type is required"),
    ambiance_tags: z
        .array(z.string())
        .min(1, "At least one ambiance tag is required"),
    price_range: z.string().min(1, "Price range is required"),
});

export const updateRestaurantSchema = z.object({
    name: z.string().trim().min(1).optional(),
    image_url: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    cuisine_type: z.string().trim().min(1).optional(),
    ambiance_tags: z
        .array(z.string().trim().min(1))
        .min(1)
        .optional(),
    price_range: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional(),
    phone: z.string().trim().min(1).optional(),
});