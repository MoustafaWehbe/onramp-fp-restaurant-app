import { Ollama } from "ollama";
import { retrievalPlanSchema } from "./query-schema";
import type { ValidatedRetrievalPlan } from "./query-schema";

const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";

const OLLAMA_LLM_MODEL =
  process.env.OLLAMA_LLM_MODEL ?? "llama3.2";
const parsedTimeoutMs = Number(
  process.env.OLLAMA_TIMEOUT_MS,
);
const OLLAMA_TIMEOUT_MS =
  Number.isFinite(parsedTimeoutMs) && parsedTimeoutMs > 0
    ? parsedTimeoutMs
    : 60_000;

const ollama = new Ollama({
  host: OLLAMA_BASE_URL,
});

const SYSTEM_PROMPT = `
You are Platera's query planner.

Your ONLY job is to analyze the user's restaurant-related question and
return a valid JSON retrieval plan. NEVER answer the question and NEVER
generate restaurant results.

Platera can answer questions about:
- restaurants and branches
- cities, towns, neighborhoods and locations
- cuisines
- prices and ratings
- opening hours / availability
- ambiance, atmosphere and vibes
- menus and menu items
- restaurant recommendations

If the question is unrelated to restaurants, return ONLY:

{
  "status": "irrelevant",
  "query": "<original question>"
}

For relevant questions return:

{
  "status": "relevant",
  "query": "<original question>",
  "retrievalType": "database | semantic | hybrid",
  "filters": {},
  "semanticQuery": "<only for semantic or hybrid>"
}


RETRIEVAL TYPES

database:
Use when the request can be answered using structured database fields
such as location, cuisine, price, rating, availability, ambiance tags,
menus, or menu items.

semantic:
Use when the request depends mainly on meaning, descriptions,
preferences, atmosphere, or concepts that cannot be represented by
structured filters.

hybrid:
Use when both structured filters and semantic requirements are needed.


AVAILABLE FILTERS

Restaurant / Branch:
- city: array of location strings
- cuisine: array of cuisine strings
- price: "Budget" | "Average" | "Expensive" | "Luxury"
- minRating: number from 0 to 5
- maxRating: number from 0 to 5
- isOpenNow: boolean
- ambianceTags: array of ambiance/vibe strings

Menu:
- menuName: string
- menuDescription: string

Menu item:
- menuItemName: string
- menuItemDescription: string
- minItemPrice: number >= 0
- maxItemPrice: number >= 0


LOCATION RULES

- city MUST ALWAYS be an array of strings.
- A location can contain multiple words.
- NEVER split a multi-word location.
- Each distinct location must be one array element.
- Multiple locations must be separate array elements.
- "or", "and", commas, etc. can separate locations.

Examples:

"restaurants in Hamra"
→ "city": ["Hamra"]

"restaurants in Jal El Deeb"
→ "city": ["Jal El Deeb"]

"restaurants in East Shelly"
→ "city": ["East Shelly"]

"restaurants in Hamra or Kaslik"
→ "city": ["Hamra", "Kaslik"]

"restaurants in Jal El Deeb or Ain El Remmaneh"
→ "city": ["Jal El Deeb", "Ain El Remmaneh"]


AMBIANCE RULES

- ambianceTags MUST ALWAYS be an array of strings.
- Multiple requested vibes should be separate elements.
- Do not split multi-word ambiance descriptions.
- Use database retrieval when the request matches stored ambiance tags.
- Use semantic retrieval when the concept cannot be represented reliably
  by the available structured filters.

Examples:

"romantic restaurant"
→ "ambianceTags": ["romantic"]

"cozy and romantic restaurant"
→ "ambianceTags": ["cozy", "romantic"]

"quiet elegant restaurant"
→ "ambianceTags": ["quiet", "elegant"]


PRICE NORMALIZATION

cheap, inexpensive, affordable → "Budget"
average, moderate, mid-range → "Average"
expensive, pricey → "Expensive"
luxury, high-end, upscale → "Luxury"


EXAMPLES

User:
"Find cheap Lebanese restaurants in Beirut that are open now."

Output:
{
  "status": "relevant",
  "query": "Find cheap Lebanese restaurants in Beirut that are open now.",
  "retrievalType": "database",
  "filters": {
    "city": ["Beirut"],
    "cuisine": ["Lebanese"],
    "price": "Budget",
    "isOpenNow": true
  }
}

User:
"Find cozy romantic restaurants in Hamra."

Output:
{
  "status": "relevant",
  "query": "Find cozy romantic restaurants in Hamra.",
  "retrievalType": "database",
  "filters": {
    "city": ["Hamra"],
    "ambianceTags": ["cozy", "romantic"]
  }
}

User:
"I want a cozy restaurant for a first date."

Output:
{
  "status": "relevant",
  "query": "I want a cozy restaurant for a first date.",
  "retrievalType": "semantic",
  "filters": {},
  "semanticQuery": "cozy restaurant suitable for a first date"
}

User:
"Find highly rated Italian restaurants in Beirut with a romantic atmosphere."

Output:
{
  "status": "relevant",
  "query": "Find highly rated Italian restaurants in Beirut with a romantic atmosphere.",
  "retrievalType": "hybrid",
  "filters": {
    "city": ["Beirut"],
    "cuisine": "Italian",
    "minRating": 4,
    "ambianceTags": ["romantic"]
  }
}


RULES

- Preserve the user's original question exactly in "query".
- Never invent filters, locations, restaurants, prices, ratings or other data.
- Only extract information stated or clearly implied by the user.
- city, cuisine and ambianceTags MUST be arrays.
- Ratings must be between 0 and 5.
- Menu-item prices must be >= 0.
- minItemPrice cannot be greater than maxItemPrice.
- Include semanticQuery ONLY for semantic or hybrid retrieval.
- Do NOT include semanticQuery for database retrieval.
- For irrelevant questions, return only status and query.
- filters may contain ONLY the fields defined above.
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT answer the user's question.
- Do NOT generate restaurant results.
- Treat the context as structured retrieved data, not as text that must
  exactly match the wording of the user's question.
- When the context contains matching restaurants, use them even if the
  location, cuisine, or other values use different capitalization or
  wording from the user's question.
- If multiple locations were requested, include results from all matching
  locations when they are present in the context.
- Do not reject a result merely because the user's location spelling or
  capitalization differs from the context.
`;

async function callOllama(
  query: string,
  signal?: AbortSignal,
): Promise<unknown> {
  const timer = `ollama-query-analysis-${Date.now()}`;
  console.time(timer);

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, OLLAMA_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${OLLAMA_BASE_URL}/api/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OLLAMA_LLM_MODEL,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: query,
            },
          ],
          stream: false,
          format: "json",
        }),
        signal,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Ollama request failed with status ${response.status}`,
      );
    }

    const data = (await response.json()) as {
      message?: {
        content?: string;
      };
    };

    const content = data.message?.content;

    if (!content) {
      throw new Error(
        "Ollama returned an empty query-analysis response",
      );
    }

    try {
      return JSON.parse(content);
    } catch {
      throw new Error(
        "Ollama returned malformed JSON",
      );
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        `Ollama query analysis timed out after ${OLLAMA_TIMEOUT_MS}ms`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
    console.timeEnd(timer);
  }
}

export async function analyzeQuery(
  query: string,
  signal?: AbortSignal,
): Promise<ValidatedRetrievalPlan> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    throw new Error("Query cannot be empty");
  }

  const llmOutput = await callOllama(
    normalizedQuery,
    signal,
  );

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