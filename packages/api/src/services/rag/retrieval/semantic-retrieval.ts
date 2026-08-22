import { retrievalRepository } from "../repositories/retrieval.repository";

export async function semanticRetrieval(
  embedding: number[],
  limit = 10
) {
  return retrievalRepository.searchEmbedding(
    embedding,
    limit
  );
}