import { embeddingsQueue, Restaurant, RestaurantClaim } from "@fp_restaurant/shared";
import { UniqueConstraintError } from "sequelize";
import { generateSlug } from "../../lib/slug";
import { createError } from "../../middleware/error-handler";
import { getDatabase } from "../../lib/db";
import {
  storageService,
  type UploadableFile,
} from "../storage/storage.service";
import { PriceRange } from "@fp_restaurant/shared";

interface CreateRestaurantData {
  userId: string;
  description: string;
  cuisine_type: string;
  ambiance_tags: string[];
  price_range: PriceRange;
  image: UploadableFile;
}

interface UpdateRestaurantData {
  name?: string;
  image?: UploadableFile;
  description?: string;
  cuisine_type?: string;
  ambiance_tags?: string[];
  price_range?: PriceRange;
  email?: string;
  phone?: string;
}

function handleUniqueSlugError(error: unknown): never {
  if (error instanceof UniqueConstraintError) {
    const constraint = (error.parent as { constraint?: string })?.constraint;
    if (constraint === "restaurants_slug_unique") {
      throw createError("A restaurant with this name already exists", 409);
    }
  }
  throw error;
}

export const restaurantService = {
  create: async ({
    userId,
    description,
    cuisine_type,
    ambiance_tags,
    price_range,
    image,
  }: CreateRestaurantData) => {
    const claim = await RestaurantClaim.findOne({
      where: {
        userId,
        restaurantId: null,
        status: "approved",
      },
    });

    if (!claim) {
      throw createError(
        "You do not have an approved restaurant claim for a new restaurant",
        403,
      );
    }

    const slug = generateSlug(claim.restaurantName);

    if (!slug) {
      throw createError(
        "Restaurant name must contain at least one alphanumeric character",
        400,
      );
    }

    const restaurantId = crypto.randomUUID();

    const image_url = await storageService.uploadFile(
      image,
      `restaurants/${restaurantId}`,
    );

    try {
      const created = await getDatabase().transaction(async (transaction) => {
        const created = await Restaurant.create(
          {
            id: restaurantId,
            name: claim.restaurantName,
            email: claim.email,
            phone: claim.phone,
            slug,
            description,
            cuisine_type,
            ambiance_tags,
            price_range,
            image_url,
            review_count: 0,
            average_rating: 0,
          },
          { transaction },
        );

        await claim.update(
          {
            restaurantId: created.id,
            status: "completed",
          },
          { transaction },
        );

        return created;
      });

      await embeddingsQueue.add("INDEX_RESTAURANT", {
        restaurantId: created.id,
      });

      return created;
    } catch (error) {
      await storageService.deleteFile(image_url).catch(() => {});
      handleUniqueSlugError(error);
    }
  },

  update: async (slug: string, data: UpdateRestaurantData) => {
    const restaurant = await Restaurant.findOne({ where: { slug } });

    if (!restaurant) {
      throw createError("Restaurant not found", 404);
    }

    let newSlug: string | undefined;

    if (data.name && data.name !== restaurant.name) {
      newSlug = generateSlug(data.name);

      if (!newSlug) {
        throw createError(
          "Restaurant name must contain at least one alphanumeric character",
          400,
        );
      }

      const existingRestaurant = await Restaurant.findOne({
        where: { slug: newSlug },
      });

      if (existingRestaurant && existingRestaurant.id !== restaurant.id) {
        throw createError("A restaurant with this name already exists", 409);
      }
    }

    // Capture the old URL BEFORE any update touches the instance.
    const oldImageUrl = restaurant.image_url;
    let newImageUrl: string | undefined;

    if (data.image) {
      newImageUrl = await storageService.uploadFile(
        data.image,
        `restaurants/${restaurant.id}`,
      );
    }

    const { image, ...rest } = data;
    const updateData: Record<string, unknown> = { ...rest };

    if (newSlug) updateData.slug = newSlug;
    if (newImageUrl) updateData.image_url = newImageUrl;

    try {
      await restaurant.update(updateData);

      if (newImageUrl && oldImageUrl) {
        await storageService.deleteFile(oldImageUrl).catch(() => {});
      }

      await embeddingsQueue.add("INDEX_RESTAURANT",
        {
          restaurantId: restaurant.id,
        }
      )

      return restaurant;
    } catch (error) {
      if (newImageUrl) {
        await storageService.deleteFile(newImageUrl).catch(() => {});
      }
      handleUniqueSlugError(error);
    }
  },

  getBySlug: async (slug: string) => {
    const restaurant = await Restaurant.findOne({ where: { slug } });

    if (!restaurant) {
      throw createError("Restaurant not found", 404);
    }

    return restaurant;
  },
};