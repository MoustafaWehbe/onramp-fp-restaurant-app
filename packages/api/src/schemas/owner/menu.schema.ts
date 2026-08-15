import { z } from "zod";

const menuItemFields = {
  name: z
    .string()
    .min(1, "Menu item name is required")
    .max(255, "Menu item name is too long"),

  description: z.string().nullable().optional(),

  base_price: z.number().min(0, "Base price cannot be negative"),

  display_order: z.number().int().min(0).optional(),

  is_active: z.boolean().optional(),
};

const createMenuItemSchema = z.object(menuItemFields);

const restaurantSlugSchema = z.object({
  restaurantSlug: z.string().min(1, "Restaurant slug is required"),
});

const branchSlugSchema = z.object({
  branchSlug: z.string().min(1, "Branch slug is required"),
});

const menuIdSchema = z.object({
  menuId: z.string().uuid("Invalid menu ID"),
});

const menuItemIdSchema = z.object({
  menuItemId: z.string().uuid("Invalid menu item ID"),
});

export const createMenuParamsSchema = restaurantSlugSchema;

export const createMenuBodySchema = z.object({
  name: z
    .string()
    .min(1, "Menu name is required")
    .max(255, "Menu name is too long"),

  description: z.string().nullable().optional(),

  is_active: z.boolean().optional(),

  items: z.array(createMenuItemSchema).optional(),
});

export const createMenuItemParamsSchema =
  restaurantSlugSchema.merge(menuIdSchema);

export const createMenuItemBodySchema = createMenuItemSchema;

export const overrideBranchMenuItemParamsSchema = restaurantSlugSchema
  .merge(branchSlugSchema)
  .merge(menuItemIdSchema);

export const overrideBranchMenuItemBodySchema = z
  .object({
    customPrice: z
      .number()
      .min(0, "Custom price cannot be negative")
      .nullable()
      .optional(),

    isAvailable: z.boolean().optional(),
  })
  .refine(
    (data) => data.customPrice !== undefined || data.isAvailable !== undefined,
    {
      message: "At least one of customPrice or isAvailable must be provided",
    },
  );

export const getRestaurantMenusSchema = restaurantSlugSchema;

export const getBranchMenusSchema =
  restaurantSlugSchema.merge(branchSlugSchema);

export const deleteMenuSchema = restaurantSlugSchema.merge(menuIdSchema);

export const updateMenuParamsSchema = restaurantSlugSchema.merge(menuIdSchema);

export const updateMenuBodySchema = z
  .object({
    name: z
      .string()
      .min(1, "Menu name cannot be empty")
      .max(255, "Menu name is too long")
      .optional(),

    description: z.string().nullable().optional(),

    is_active: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.description !== undefined ||
      data.is_active !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export const updateMenuItemParamsSchema = restaurantSlugSchema
  .merge(menuIdSchema)
  .merge(menuItemIdSchema);

export const updateMenuItemBodySchema = z
  .object({
    name: menuItemFields.name.optional(),

    description: menuItemFields.description,

    base_price: menuItemFields.base_price.optional(),

    display_order: menuItemFields.display_order,

    is_active: menuItemFields.is_active,
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.description !== undefined ||
      data.base_price !== undefined ||
      data.display_order !== undefined ||
      data.is_active !== undefined,
    {
      message: "At least one field must be provided",
    },
  );
