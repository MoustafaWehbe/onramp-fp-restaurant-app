import { retrievalRepository } from "../repositories/retrieval.repository";

import type { ValidatedRetrievalPlan } from "../query/query-schema";

export async function databaseRetrieval(
    plan: ValidatedRetrievalPlan
) {
    const result = await retrievalRepository.searchRestaurants(
        plan.filters ?? {}
    );
    return result;
}