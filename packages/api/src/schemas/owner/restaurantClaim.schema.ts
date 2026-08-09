import { z } from "zod";

export const createRestaurantClaimSchema = z.object({
  restaurantId: z
    .string()
    .uuid()
    .nullable()
    .optional(),

  restaurantName: z
    .string()
    .min(1, "Restaurant name is required")
    .max(255, "Restaurant name is too long"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(50, "Phone number is too long"),
});