import { Ollama } from "ollama";
import { retrievalPlanSchema } from "./query-schema";
import type { ValidatedRetrievalPlan } from "./query-schema";

const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";

const OLLAMA_LLM_MODEL =
  process.env.OLLAMA_LLM_MODEL ?? "llama3.2";

const OLLAMA_TIMEOUT_MS = Number(
  process.env.OLLAMA_TIMEOUT_MS ?? 30_000,
);

const ollama = new Ollama({
  host: OLLAMA_BASE_URL,
});

const SYSTEM_PROMPT = `
You are the query planner for a restaurant discovery application.

Your job is to analyze the user's question and determine whether it
is relevant to the restaurant application.

The application can answer questions about:
- restaurants
- restaurant branches
- cuisines
- locations
- prices
- ratings
- opening hours and availability
- menus and menu items
- restaurant atmosphere, vibe, and characteristics
- restaurant recommendations

If the user's question is completely unrelated to restaurants or
restaurant discovery, return:

{
  "status": "irrelevant",
  "query": "<original question>"
}

For relevant questions, return:

{
  "status": "relevant",
  "query": "<original question>",
  "retrievalType": "database | semantic | hybrid",
  "filters": {},
  "semanticQuery": "<semantic part if needed>"
}

Retrieval types:

1. database
Use when the request can be answered using structured database
filters such as city, cuisine, price, rating, or availability.

2. semantic
Use when the request depends mainly on semantic meaning,
preferences, descriptions, atmosphere, vibe, or concepts that
cannot be represented as structured database filters.

3. hybrid
Use when the request contains both structured filters and
semantic requirements.

Available filters:

Restaurant / branch filters:
- city: restaurant city
- cuisine: cuisine type
- price: "Budget", "Average", "Expensive", or "Luxury"
- minRating: minimum rating from 0 to 5
- maxRating: maximum rating from 0 to 5
- isOpenNow: whether the restaurant should currently be open

Menu filters:
- menuName: name of the menu
- menuDescription: description of the menu

Menu item filters:
- menuItemName: name of the menu item
- menuItemDescription: description of the menu item
- minItemPrice: minimum menu-item price, must be 0 or greater
- maxItemPrice: maximum menu-item price, must be 0 or greater

Rules:

- Preserve the user's original question in "query".
- Never invent filters.
- Only extract information explicitly stated or clearly implied.
- Normalize price to one of:
  "Budget", "Average", "Expensive", "Luxury".
- Ratings must be between 0 and 5.
- Menu-item prices must be 0 or greater.
- If both minItemPrice and maxItemPrice are present,
  minItemPrice must not be greater than maxItemPrice.
- For semantic or hybrid retrieval, include semanticQuery.
- For database retrieval, omit semanticQuery.
- For irrelevant questions, only return status and query.
- Return ONLY valid JSON.
- Do not return markdown.
`;

async function callOllama(
  query: string,
): Promise<unknown> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `Ollama query analysis timed out after ${OLLAMA_TIMEOUT_MS}ms`,
        ),
      );
    }, OLLAMA_TIMEOUT_MS);
  });

  const request = ollama.generate({
    model: OLLAMA_LLM_MODEL,
    system: SYSTEM_PROMPT,
    prompt: query,
    stream: false,
    format: "json",
  });

  const response = await Promise.race([
    request,
    timeout,
  ]);

  if (!response.response) {
    throw new Error(
      "Ollama returned an empty query-analysis response",
    );
  }

  try {
    return JSON.parse(response.response);
  } catch {
    throw new Error(
      "Ollama returned malformed JSON",
    );
  }
}

export async function analyzeQuery(
  query: string,
): Promise<ValidatedRetrievalPlan> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    throw new Error("Query cannot be empty");
  }

  const llmOutput = await callOllama(normalizedQuery);

  if (
    typeof llmOutput !== "object" ||
    llmOutput === null ||
    Array.isArray(llmOutput)
  ) {
    throw new Error(
      "Ollama query analysis must return a JSON object",
    );
  }

  const plan = retrievalPlanSchema.parse({
    ...llmOutput,
    query: normalizedQuery,
  });

  return plan;
}