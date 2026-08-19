import { getMenuById } from "../repositories/menu.repository.js";
import { embeddingRepository } from "../repositories/embedding.repository.js";
import { generateEmbedding } from "../lib/ai.js";

export async function indexMenu(
    menuId: string
): Promise<void> {
    const menu = await getMenuById(menuId);

    if (!menu) {
        throw new Error(`Menu not found: ${menuId}`);
    }

    const content = [
        `Menu: ${menu.name}`,
        menu.description
            ? `Description: ${menu.description}`
            : null,
    ]
        .filter((value): value is string => value !== null)
        .join("\n");

    const embedding = await generateEmbedding(content);

    await embeddingRepository.upsert({
        entityType: "menu",
        entityId: menu.id,
        content,
        embedding,
    });
}