import type { HybridRetrievalResult } from "../retrieval/hybrid-retrieval";

type DatabaseRetrievalResult = {
  rows?: unknown[];
  count?: number | unknown[];
};

type SemanticRetrievalResult = {
  id: string;
  entityType: string;
  entityId: string;
  content: string;
  metadata?: Record<string, unknown> | null;
  distance: number;
};

export type RetrievalResult =
  | DatabaseRetrievalResult
  | SemanticRetrievalResult[]
  | HybridRetrievalResult[];

function isHybridResults(
  results: RetrievalResult
): results is HybridRetrievalResult[] {
  return (
    Array.isArray(results) &&
    results.length > 0 &&
    "entityType" in results[0] &&
    "source" in results[0]
  );
}

function isSemanticResults(
  results: RetrievalResult
): results is SemanticRetrievalResult[] {
  return (
    Array.isArray(results) &&
    results.length > 0 &&
    "distance" in results[0] &&
    "content" in results[0]
  );
}

function getRows(
  results: RetrievalResult
): unknown[] {
  if (
    !Array.isArray(results) &&
    results &&
    "rows" in results
  ) {
    return results.rows ?? [];
  }

  return [];
}

function formatValue(
  value: unknown
): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return JSON.stringify(value);
}

function formatDatabaseEntity(
  entity: any
): string {
  const restaurant =
    entity?.dataValues ?? entity;

  const lines: string[] = [];

  if (restaurant.name) {
    lines.push(`Restaurant: ${restaurant.name}`);
  }

  if (restaurant.cuisine_type) {
    lines.push(
      `Cuisine: ${restaurant.cuisine_type}`
    );
  }

  if (restaurant.price_range) {
    lines.push(
      `Price range: ${restaurant.price_range}`
    );
  }

  if (
    restaurant.average_rating !== undefined
  ) {
    lines.push(
      `Rating: ${restaurant.average_rating}`
    );
  }

  if (restaurant.review_count !== undefined) {
    lines.push(
      `Reviews: ${restaurant.review_count}`
    );
  }

  const branches =
    restaurant.Branches ??
    restaurant.branches;

  if (Array.isArray(branches)) {
    for (const branch of branches) {
      const branchData =
        branch?.dataValues ?? branch;

      lines.push("");

      if (branchData.name) {
        lines.push(
          `Branch: ${branchData.name}`
        );
      }

      if (branchData.city) {
        lines.push(
          `City: ${branchData.city}`
        );
      }

      if (branchData.address) {
        lines.push(
          `Address: ${branchData.address}`
        );
      }

      if (branchData.phone) {
        lines.push(
          `Phone: ${branchData.phone}`
        );
      }

      if (branchData.opening_hours) {
        lines.push(
          `Opening hours: ${branchData.opening_hours}`
        );
      }
    }
  }

  return lines.join("\n");
}

function formatSemanticEntity(
  result: SemanticRetrievalResult
): string {
  return [
    `Entity type: ${result.entityType}`,
    `Entity ID: ${result.entityId}`,
    `Content: ${result.content}`,
  ].join("\n");
}

function formatHybridEntity(
  result: HybridRetrievalResult
): string {
  const lines: string[] = [
    `Entity type: ${result.entityType}`,
    `Entity ID: ${result.entityId}`,
    `Source: ${result.source}`,
  ];

  if (
    result.semanticDistance !== null
  ) {
    lines.push(
      `Semantic distance: ${result.semanticDistance}`
    );
  }

  if (result.databaseResult) {
    lines.push("");
    lines.push(
      formatDatabaseEntity(
        result.databaseResult
      )
    );
  }

  if (result.semanticResult) {
    lines.push("");
    lines.push(
      `Semantic content: ${result.semanticResult.content}`
    );
  }

  return lines.join("\n");
}

export function buildContext(
  results: RetrievalResult
): string {
  if (!results) {
    return "No relevant information was found.";
  }

  if (isHybridResults(results)) {
    if (results.length === 0) {
      return "No relevant information was found.";
    }

    return results
      .map(
        (result, index) =>
          `--- Result ${index + 1} ---\n${formatHybridEntity(result)}`
      )
      .join("\n\n");
  }

  if (isSemanticResults(results)) {
    if (results.length === 0) {
      return "No relevant information was found.";
    }

    return results
      .map(
        (result, index) =>
          `--- Result ${index + 1} ---\n${formatSemanticEntity(result)}`
      )
      .join("\n\n");
  }

  const rows = getRows(results);

  if (rows.length === 0) {
    return "No relevant information was found.";
  }

  return rows
    .map(
      (entity, index) =>
        `--- Restaurant ${index + 1} ---\n${formatDatabaseEntity(entity)}`
    )
    .join("\n\n");
}