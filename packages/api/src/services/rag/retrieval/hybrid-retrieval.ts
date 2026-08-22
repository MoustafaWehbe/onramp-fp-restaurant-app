import { retrievalRepository } from "../repositories/retrieval.repository";
import type { ValidatedRetrievalPlan } from "../query/query-schema";

interface SemanticRetrievalResult {
  id: string;
  entityType: string;
  entityId: string;
  content: string;
  metadata: Record<string, unknown> | null;
  distance: number;
}

export interface HybridRetrievalResult {
  entityType: string;
  entityId: string;

  //Database result when the entity matched the structured query.
  databaseResult?: unknown;

  // Semantic result when the entity matched the vector search.   
  semanticResult?: SemanticRetrievalResult;

  //Lower distance = better semantic match.
  // null means that the result came only from database retrieval.
  semanticDistance: number | null;

  //Indicates where the result came from.
  source: "database" | "semantic" | "hybrid";
}

function getRestaurantId(
  restaurant: any
): string | undefined {
  const id = restaurant?.id;

  return id === undefined || id === null
    ? undefined
    : String(id);
}

function buildKey(
  entityType: string,
  entityId: string
): string {
  return `${entityType.toLowerCase()}:${entityId}`;
}

export async function hybridRetrieval(
  plan: ValidatedRetrievalPlan,
  embedding: number[],
  limit = 10
): Promise<HybridRetrievalResult[]> {
  const [databaseResponse, semanticResponse] =
    await Promise.all([
      retrievalRepository.searchRestaurants(
        plan.filters ?? {},
        limit
      ),

      retrievalRepository.searchEmbedding(
        embedding,
        limit
      ),
    ]);


  const databaseResults =
    databaseResponse.rows ?? [];

  const semanticResults =
    semanticResponse as SemanticRetrievalResult[];

  const databaseById = new Map<
    string,
    unknown
  >();

  for (const restaurant of databaseResults) {
    const restaurantId =
      getRestaurantId(restaurant);

    if (restaurantId === undefined) {
      continue;
    }

    databaseById.set(
      buildKey("restaurant", restaurantId),
      restaurant
    );
  }


  const results = new Map<
    string,
    HybridRetrievalResult
  >();

  //Add database candidates

  for (const restaurant of databaseResults) {
    const restaurantId =
      getRestaurantId(restaurant);

    if (restaurantId === undefined) {
      continue;
    }

    const key =
      buildKey("restaurant", restaurantId);

    results.set(key, {
      entityType: "restaurant",
      entityId: restaurantId,
      databaseResult: restaurant,
      semanticDistance: null,
      source: "database",
    });
  }

  // Add semantic candidates

  for (const semanticResult of semanticResults) {
    const {
      entityType,
      entityId,
      distance,
    } = semanticResult;

    const key =
      buildKey(entityType, entityId);

    if (
      entityType.toLowerCase() === "restaurant" &&
      databaseById.has(key)
    )

      //Restaurant semantic result that also matched structured retrieval.

      if (
        entityType === "restaurant" &&
        databaseById.has(entityId)
      ) {
        const existing = results.get(key);

        if (existing) {
          existing.semanticResult =
            semanticResult;

          existing.semanticDistance =
            distance;

          existing.source =
            "hybrid";
        }

        continue;
      }

    /*
     * Semantic-only result.
     */
    results.set(key, {
      entityType,
      entityId,
      semanticResult,
      semanticDistance: distance,
      source: "semantic",
    });
  }

  /*
   * ---------------------------------------------------------
   * Ranking
   * ---------------------------------------------------------
   *
   * Semantic results have a real numeric relevance signal:
   *
   *   lower cosine distance = better match
   *
   * Database-only results do not have a relevance score.
   *
   * Therefore:
   *
   * 1. Hybrid results first
   * 2. Semantic results ordered by distance
   * 3. Database-only results last
   */
  const rankedResults =
    Array.from(results.values());

  rankedResults.sort((a, b) => {
    /*
     * Hybrid results are preferred because they satisfy
     * both structured and semantic retrieval.
     */
    if (
      a.source === "hybrid" &&
      b.source !== "hybrid"
    ) {
      return -1;
    }

    if (
      a.source !== "hybrid" &&
      b.source === "hybrid"
    ) {
      return 1;
    }

    /*
     * If both have semantic scores, lower distance
     * means a better semantic match.
     */
    if (
      a.semanticDistance !== null &&
      b.semanticDistance !== null
    ) {
      return (
        a.semanticDistance -
        b.semanticDistance
      );
    }

    /*
     * Semantic results are preferred over
     * database-only results.
     */
    if (
      a.semanticDistance !== null &&
      b.semanticDistance === null
    ) {
      return -1;
    }

    if (
      a.semanticDistance === null &&
      b.semanticDistance !== null
    ) {
      return 1;
    }

    return 0;
  });

  return rankedResults.slice(0, limit);
}