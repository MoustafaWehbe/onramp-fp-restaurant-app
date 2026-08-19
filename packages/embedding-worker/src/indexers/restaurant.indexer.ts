import { generateEmbedding } from "../lib/ai.js";
import { embeddingRepository } from "../repositories/embedding.repository.js";
import { getRestaurantById } from "../repositories/restaurant.repository.js";

export async function indexRestaurant(
    restaurantId: string
): Promise<void> {
    const restaurant = await getRestaurantById(restaurantId);

    if (!restaurant) {
        throw new Error(`Restaurant not found: ${restaurantId}`);
    }

    const content = [
        `Restaurant: ${restaurant.name}`,
        `Description: ${restaurant.description}`,
        `Cuisine: ${restaurant.cuisine_type}`,
        `Ambiance: ${restaurant.ambiance_tags.join(", ")}`,
    ].join("\n");

    const embedding = await generateEmbedding(content);

    await embeddingRepository.upsert({
        entityType: "restaurant",
        entityId: restaurant.id,
        content,
        embedding,
    });
}