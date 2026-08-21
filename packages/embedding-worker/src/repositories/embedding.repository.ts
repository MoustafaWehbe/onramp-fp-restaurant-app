import { SearchEmbedding } from "@fp_restaurant/shared/db/models/SearchEmbedding.js";
import { QueryTypes } from "sequelize";

interface UpsertEmbeddingInput {
    entityType: string;
    entityId: string;
    content: string;
    embedding: number[];
    metadata?: Record<string, unknown>;
}

interface SearchSimilarInput {
    embedding: number[];
    limit?: number;
    entityType?: string;
}

export interface SimilarEmbeddingResult {
    entityType: string;
    entityId: string;
    content: string;
    distance: number;
    similarity: number;
}
const EMBEDDING_DIMENSION = 768;

export const embeddingRepository = {
    upsert: async ({
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
            ...(metadata !== undefined ? { metadata } : {}),
        },
            {
                conflictFields: ["entityType", "entityId"],
            });
    },

    delete: async (
        entityType: string,
        entityId: string
    ) => {
        return await SearchEmbedding.destroy({
            where: {
                entityId,
                entityType,
            }
        })
    },
    searchSimilar: async ({
        embedding,
        limit = 10,
        entityType,
    }: SearchSimilarInput): Promise<SimilarEmbeddingResult[]> => {
        if (embedding.length !== EMBEDDING_DIMENSION) {
            throw new Error(
                `Invalid embedding dimension: expected ${EMBEDDING_DIMENSION}, received ${embedding.length}`,
            );
        }

        if (limit <= 0) {
            throw new Error("Search limit must be greater than 0");
        }

        const sequelize = SearchEmbedding.sequelize;

        if (!sequelize) {
            throw new Error(
                "SearchEmbedding Sequelize instance is not initialized",
            );
        }

        const entityTypeFilter = entityType
            ? `AND entity_type = :entityType`
            : "";

        const replacements: Record<string, unknown> = {
            queryEmbedding: `[${embedding.join(",")}]`,
            limit,
        };

        if (entityType) {
            replacements.entityType = entityType;
        }

        const results = await sequelize.query<{
            entityType: string;
            entityId: string;
            content: string;
            distance: number;
        }>(
            `
                SELECT
                    entity_type AS "entityType",
                    entity_id AS "entityId",
                    content,
                    embedding <=> :queryEmbedding::vector AS distance
                FROM search_embeddings
                WHERE embedding IS NOT NULL
                ${entityTypeFilter}
                ORDER BY distance ASC
                LIMIT :limit
            `,
            {
                replacements,
                type: QueryTypes.SELECT,
            },
        );

        return results.map((result) => {
            const distance = Number(result.distance);

            return {
                entityType: result.entityType,
                entityId: result.entityId,
                content: result.content,
                distance,
                similarity: 1 - distance,
            };
        });
    },
}