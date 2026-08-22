import { SearchEmbedding } from "@fp_restaurant/shared";

interface UpsertEmbeddingInput {
    entityType: string;
    entityId: string;
    content: string;
    embedding: number[];
    metadata?: Record<string, unknown>;
}

export const embeddingRepository = {
    upsert: async({
        entityType,
        entityId,
        content,
        embedding,
        metadata
    }: UpsertEmbeddingInput) => {
        await SearchEmbedding.upsert({
            entityType,
            entityId,
            content,
            embedding: `[${embedding.join(",")}]` as any,
            ...(metadata !== undefined ? {metadata} : {}),
        },
        {
            conflictFields: ["entity_type", "entity_id"] as any,
        });
    },

    delete: async(
        entityType: string,
        entityId: string
    ) => {
       return await SearchEmbedding.destroy({
            where: {
                entityId,
                entityType,
            }
        })
    }
}