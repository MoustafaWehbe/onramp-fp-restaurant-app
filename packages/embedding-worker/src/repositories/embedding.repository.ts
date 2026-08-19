import { SearchEmbedding } from "@fp_restaurant/shared/db/models/SearchEmbedding.js";

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
            embedding,
            ...(metadata !== undefined ? {metadata} : {}),
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