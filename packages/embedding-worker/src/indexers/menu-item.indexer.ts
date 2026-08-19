import { generateEmbedding } from "@fp_restaurant/shared";
import { getMenuItemById } from "../repositories/menu-item.repository.js";
import { embeddingRepository } from "../repositories/embedding.repository.js";


export async function indexMenuItem(
    menuItemId: string
): Promise<void> {
    const menuItem = await getMenuItemById(menuItemId);

    if (!menuItem) {
        throw new Error(`Menu item not found: ${menuItemId}`);
    }

    const content = [
        `Menu item: ${menuItem.name}`,
        menuItem.description
            ? `Description: ${menuItem.description}`
            : null,
    ]
        .filter((value): value is string => value !== null)
        .join("\n");

    const embedding = await generateEmbedding(content);

    await embeddingRepository.upsert({
        entityType: "menu_item",
        entityId: menuItem.id,
        content,
        embedding,
        metadata: {
            menuId: menuItem.menuId,
        }
    });
}