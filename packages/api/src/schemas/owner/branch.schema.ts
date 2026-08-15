import { z } from "zod";

export const ownerBranchParamsSchema = z.object({
    restaurantSlug: z
        .string()
        .trim()
        .min(1, "Restaurant slug is required"),
});

export const ownerBranchUpdateParamsSchema = z.object({
    restaurantSlug: z
        .string()
        .trim()
        .min(1, "Restaurant slug is required"),

    branchSlug: z
        .string()
        .trim()
        .min(1, "Branch slug is required"),
});

export const createBranchSchema = z.object({
  name: z.string().trim().min(1, "Branch name is required"),

  city: z.string().trim().min(1, "City is required"),

  address: z.string().trim().min(1, "Address is required"),

  latitude: z
    .string()
    .regex(
      /^-?\d+(\.\d+)?$/,
      "Latitude must be a valid number",
    )
    .refine(
      (value) => {
        const latitude = Number(value);
        return latitude >= -90 && latitude <= 90;
      },
      "Latitude must be between -90 and 90",
    ),

  longitude: z
    .string()
    .regex(
      /^-?\d+(\.\d+)?$/,
      "Longitude must be a valid number",
    )
    .refine(
      (value) => {
        const longitude = Number(value);
        return longitude >= -180 && longitude <= 180;
      },
      "Longitude must be between -180 and 180",
    ),

  phone: z.string().optional().nullable(),

  opening_hours: z.string().min(1, "Opening hours are required"),
});

export const updateBranchSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Branch name is required")
    .optional(),

  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .optional(),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .optional(),

  latitude: z
    .string()
    .regex(
      /^-?\d+(\.\d+)?$/,
      "Latitude must be a valid number",
    )
    .refine(
      (value) => {
        const latitude = Number(value);
        return latitude >= -90 && latitude <= 90;
      },
      "Latitude must be between -90 and 90",
    )
    .optional(),

  longitude: z
    .string()
    .regex(
      /^-?\d+(\.\d+)?$/,
      "Longitude must be a valid number",
    )
    .refine(
      (value) => {
        const longitude = Number(value);
        return longitude >= -180 && longitude <= 180;
      },
      "Longitude must be between -180 and 180",
    )
    .optional(),

  phone: z.string().optional().nullable(),

  opening_hours: z
    .string()
    .min(1, "Opening hours are required")
    .optional(),
});