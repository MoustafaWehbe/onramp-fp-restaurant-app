import { z } from "zod";

export const ownerBranchParamsSchema = z.object({
  restaurantId: z.string().uuid("Invalid restaurant ID"),
});

export const ownerBranchUpdateParamsSchema = z.object({
  restaurantId: z.string().uuid("Invalid restaurant ID"),
  branchId: z.string().uuid("Invalid branch ID"),
});

export const createBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),

  latitude: z.string().regex(
    /^-?\d+(\.\d+)?$/,
    "Latitude must be a valid number",
  ),

  longitude: z.string().regex(
    /^-?\d+(\.\d+)?$/,
    "Longitude must be a valid number",
  ),

  phone: z.string().optional().nullable(),

  opening_hours: z.string().min(1, "Opening hours are required"),
});

export const updateBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required").optional(),

  city: z.string().min(1, "City is required").optional(),

  address: z.string().min(1, "Address is required").optional(),

  latitude: z.string().regex(
    /^-?\d+(\.\d+)?$/,
    "Latitude must be a valid number",
  ).optional(),

  longitude: z.string().regex(
    /^-?\d+(\.\d+)?$/,
    "Longitude must be a valid number",
  ).optional(),

  phone: z.string().optional().nullable(),

  opening_hours: z.string().min(1, "Opening hours are required").optional(),
});