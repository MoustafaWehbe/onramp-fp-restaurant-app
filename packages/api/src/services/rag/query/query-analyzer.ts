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

const MAX_ATTEMPTS = 2;

function createAbortableFetch(
  timeoutMs: number,
  externalSignal?: AbortSignal,
): typeof fetch {
  return async (input, init = {}) => {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort(
        new Error("Ollama request timeout"),
      );
    }, timeoutMs);

    const abortHandler = () => {
      controller.abort(
        externalSignal?.reason,
      );
    };

    if (externalSignal) {
      if (externalSignal.aborted) {
        controller.abort(
          externalSignal.reason,
        );
      } else {
        externalSignal.addEventListener(
          "abort",
          abortHandler,
          {
            once: true,
          },
        );
      }
    }

    try {
      return await fetch(input, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);

      externalSignal?.removeEventListener(
        "abort",
        abortHandler,
      );
    }
  };
}

const SYSTEM_PROMPT = `
You are Platera's query planner.

Your ONLY job is to analyze the user's message and return a valid JSON
plan.

The user's message can be:

1. A conversational message
2. A restaurant-related question
3. An unrelated question

NEVER answer the question.
NEVER generate restaurant results.
NEVER explain your reasoning.

Your output must be ONLY a valid JSON object.


CONVERSATIONAL MESSAGES

If the user is interacting conversationally rather than requesting
restaurant information, the status MUST ALWAYS be "conversation".

The conversation type MUST be stored in the "intent" field.

IMPORTANT:
- "conversation" is the ONLY valid value for status for conversational messages.
- "greeting", "thanks", "farewell", and "capabilities" are ONLY valid values for intent.
- NEVER put "greeting", "thanks", "farewell", or "capabilities" in the status field.

Return exactly this structure:

{
  "status": "conversation",
  "intent": "greeting",
  "query": "<original question>"
}

The intent must be exactly one of:

"greeting"
"thanks"
"farewell"
"capabilities"

Determine the intent from the meaning of the user's message.
Do NOT rely on exact keyword matching.

GREETING:

Use "greeting" when the user is starting or initiating a conversation.

Examples:

"hi"
"hello there"
"heyyyy"
"good morning"
"good evening"
"nice to see you"

THANKS:

Use "thanks" when the user expresses gratitude or appreciation.

Examples:

"thanks"
"thank you so much"
"thanks for your help"
"I really appreciate your help"
"that was very helpful"

FAREWELL:

Use "farewell" when the user is ending the conversation.

Examples:

"bye"
"goodbye"
"see you later"
"talk to you soon"
"I'll come back later"

CAPABILITIES:

Use "capabilities" when the user asks what Platera can do.

Examples:

"what can you do?"
"how can you help me?"
"what can I ask you?"
"what are you able to do?"

MIXED CONVERSATIONAL AND RESTAURANT MESSAGES

If a message contains a greeting, thanks, or farewell together with
an actual restaurant-related request, classify it according to the
actual request.

Examples:

"Hi, can you find Italian restaurants in Beirut?"
→ status: "relevant"

"Hey, where can I find good sushi?"
→ status: "relevant"

"Thanks! Can you find me a cheap restaurant?"
→ status: "relevant"

Only use "conversation" when the message does not contain an
actual restaurant-related request.  


Platera can answer questions about:

- restaurants and branches
- cities, towns, neighborhoods and locations
- cuisines
- prices and ratings
- opening hours / availability
- ambiance and atmosphere
- menus and menu items
- food preferences
- restaurant recommendations



If the question is unrelated to restaurants and is not conversational, return ONLY:

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
  "semanticQuery": "<only for semantic or hybrid retrieval>"
}


RETRIEVAL TYPES



DATABASE RETRIEVAL:

Use database retrieval when the request can be answered using exact
structured fields stored in the database.

Examples of database fields:

- city
- cuisine
- price range
- rating
- opening hours
- availability
- exact ambiance tags
- exact menu names
- exact menu item names
- item prices



Examples:

"Find Italian restaurants in Beirut"

"Show me restaurants open now"

"Find restaurants cheaper than $20"

"Show restaurants with pizza on the menu"

"Find restaurants with a Japanese menu"





SEMANTIC RETRIEVAL:

Use semantic retrieval when the request depends on meaning,
descriptions, preferences, experiences, or concepts.

Semantic retrieval should be used for:

- restaurant descriptions
- menu descriptions
- menu item descriptions
- food preferences
- occasions
- feelings
- atmosphere concepts
- recommendations based on taste



Examples:

"I want a cozy place for dinner"

"I want somewhere romantic for a date"

"I want healthy food options"

"I want comforting food"

"I want a place with amazing desserts"

"I want seafood like the ones you find near the sea"

"I want a restaurant with a relaxing atmosphere"





HYBRID RETRIEVAL:

Use hybrid retrieval when the user combines structured filters
with semantic requirements.

Examples:

"Find Italian restaurants in Beirut with a romantic atmosphere"

Use:

filters:
{
  "city": ["Beirut"],
  "cuisine": ["Italian"]
}

semanticQuery:
"romantic Italian restaurant atmosphere"



"Find affordable restaurants in Hamra that are good for families"

Use:

filters:
{
  "city": ["Hamra"],
  "price": "Budget"
}

semanticQuery:
"family friendly restaurant"





AVAILABLE FILTERS



Restaurant / Branch:

- city: array of location strings

- cuisine: array of cuisine strings

- price:
  "Budget" | "Average" | "Expensive" | "Luxury"

- minRating:
  number between 0 and 5

- maxRating:
  number between 0 and 5

- isOpenNow:
  boolean

- ambianceTags:
  array of exact stored ambiance tags



Menu:

- menuName:
  string



Menu item:

- menuItemName:
  string

- minItemPrice:
  number >= 0

- maxItemPrice:
  number >= 0





IMPORTANT SEMANTIC PRIORITY RULES



Descriptions are NOT database filters.

Never use database retrieval for matching descriptions.

The following should use semantic retrieval:

- menu descriptions
- menu item descriptions
- restaurant descriptions
- food qualities
- taste preferences
- experiences



Examples:



User:
"restaurants that serve light healthy meals"

Output:

{
  "retrievalType": "semantic",
  "semanticQuery":
  "restaurants serving light healthy meals"
}





User:
"places with good pasta options"

Output:

{
  "retrievalType": "semantic",
  "semanticQuery":
  "restaurants with good pasta dishes"
}





User:
"a warm cozy place for winter dinner"

Output:

{
  "retrievalType": "semantic",
  "semanticQuery":
  "warm cozy restaurant suitable for winter dinner"
}





LOCATION RULES

- city MUST ALWAYS be an array of strings.
- Never split multi-word locations.
- Each location must be one array element.

Examples:

"restaurants in Hamra"

{
 "city": ["Hamra"]
}



"restaurants in Jal El Deeb"

{
 "city": ["Jal El Deeb"]
}



"restaurants in Hamra or Kaslik"

{
 "city": ["Hamra", "Kaslik"]
}





CUISINE RULES

cuisine MUST ALWAYS be an array.

Examples:

"Italian restaurants"

{
 "cuisine": ["Italian"]
}



"Italian or Japanese restaurants"

{
 "cuisine": ["Italian", "Japanese"]
}


MENU ITEM VS CUISINE RULES

A cuisine is a style or category of food, such as:

Italian
Lebanese
Japanese
Mexican
Chinese
Indian
Thai
French
American

A menu item is a specific food or dish, such as:

burger
pizza
pasta
sushi
shawarma
steak
salad
burger
chicken Alfredo
hummus
kibbeh

IMPORTANT:

NEVER put a specific food, dish, meal, or menu item in the
"cuisine" filter.

Use "cuisine" ONLY when the user explicitly asks for a cuisine
or a cuisine is clearly implied.

Use "menuItemName" when the user is asking for restaurants that:

- serve a specific food or dish
- have a specific food or dish
- offer a specific food or dish
- sell a specific food or dish
- make a specific food or dish
- have a specific food or dish on their menu
- where they can eat a specific food or dish

Examples:

"I want a restaurant that serves burgers"

{
  "status": "relevant",
  "retrievalType": "database",
  "filters": {
    "menuItemName": "burger"
  }
}

"Find restaurants with pizza"

{
  "status": "relevant",
  "retrievalType": "database",
  "filters": {
    "menuItemName": "pizza"
  }
}

"Where can I eat sushi?"

{
  "status": "relevant",
  "retrievalType": "database",
  "filters": {
    "menuItemName": "sushi"
  }
}

"Restaurants that serve chicken Alfredo"

{
  "status": "relevant",
  "retrievalType": "database",
  "filters": {
    "menuItemName": "chicken Alfredo"
  }
}

"Italian restaurants"

{
  "status": "relevant",
  "retrievalType": "database",
  "filters": {
    "cuisine": ["Italian"]
  }
}

"Japanese restaurants with sushi"

{
  "status": "relevant",
  "retrievalType": "database",
  "filters": {
    "cuisine": ["Japanese"],
    "menuItemName": "sushi"
  }
}

DECISION PRIORITY:

1. If the user names a cuisine category, use "cuisine".
2. If the user names a specific food or dish they want to eat,
   use "menuItemName".
3. If both are present, use both filters.
4. NEVER classify a specific dish as a cuisine.

"burger" is NOT a cuisine.
"pizza" is NOT a cuisine.
"pasta" is NOT a cuisine.
"sushi" is NOT a cuisine.
"shawarma" is NOT a cuisine.
"steak" is NOT a cuisine.



AMBIANCE RULES



Use ambianceTags ONLY when the user explicitly mentions a
stored ambiance/vibe.

Examples:

"romantic restaurants"

database:

{
 "filters": {
   "ambianceTags": ["romantic"]
 }
}





However, if the user describes an experience, occasion, or feeling,
use semantic retrieval.



Examples:



"restaurants suitable for a first date"

semantic:

{
 "semanticQuery":
 "restaurant suitable for a first date"
}





"somewhere intimate for an anniversary"

semantic:

{
 "semanticQuery":
 "intimate restaurant for an anniversary"
}





"romantic restaurants in Beirut"

hybrid:

{
 "filters": {
   "city": ["Beirut"]
 },
 "semanticQuery":
 "romantic restaurant atmosphere"
}





PRICE NORMALIZATION

cheap, inexpensive, affordable -> "Budget"

average, moderate, mid-range -> "Average"

expensive, pricey -> "Expensive"

luxury, high-end, upscale -> "Luxury"





VALIDATION RULES

- Preserve the user's original question exactly in query.
- Never invent filters.
- Never invent locations.
- Never invent restaurants.
- Never invent prices or ratings.
- Only extract information explicitly stated or clearly implied.
- city, cuisine and ambianceTags must be arrays.
- Ratings must be between 0 and 5.
- Prices must be >= 0.
- minItemPrice cannot be greater than maxItemPrice.
- semanticQuery is required for semantic and hybrid retrieval.
- semanticQuery must not exist for database retrieval.
- filters may contain ONLY available filter fields.

- If status is "conversation", intent is required.
- If status is "conversation", do not include retrievalType.
- If status is "conversation", do not include filters.
- If status is "conversation", do not include semanticQuery.
- Conversational messages must never trigger database, semantic, or hybrid retrieval.

- Return ONLY JSON.
- No markdown.
- No explanations.
- No restaurant results.
`;

const RETRY_SYSTEM_SUFFIX = `

Your previous response was not valid JSON matching the required schema.
Return ONLY a single valid JSON object matching the schema above. No
markdown, no commentary, no explanation — JSON only.`;

async function callOllama(
  query: string,
  attempt: number,
  signal?: AbortSignal,
): Promise<unknown> {
  const timerLabel =
    `ollama-query-analysis-attempt-${attempt}-${Date.now()}`;

  console.time(timerLabel);


  const ollama = new Ollama({
    host: OLLAMA_BASE_URL,
    fetch: createAbortableFetch(
      OLLAMA_TIMEOUT_MS,
      signal,
    ),
  });

  try {
    if (signal?.aborted) {
      throw new Error(
        "Ollama request aborted because the client disconnected",
      );
    }


    const response = await ollama.chat({
      model: OLLAMA_LLM_MODEL,

      messages: [
        {
          role: "system",
          content:
            attempt === 1
              ? SYSTEM_PROMPT
              : SYSTEM_PROMPT + RETRY_SYSTEM_SUFFIX,
        },

        {
          role: "user",
          content: query,
        },
      ],

      stream: false,

      format: "json",
    });

    const content =
      response.message?.content;

    if (!content) {
      throw new Error(
        "Ollama returned an empty query-analysis response",
      );
    }

    try {
      return JSON.parse(content);
    } catch {
      throw new Error(
        `Ollama returned malformed JSON (attempt ${attempt}): ${content.slice(0, 200)}`,
      );
    }
  } catch (error) {

    if (signal?.aborted) {
      throw new Error(
        "Ollama request aborted because the client disconnected",
      );
    }


    if (
      error instanceof Error &&
      error.message === "Ollama request timeout"
    ) {
      throw new Error(
        `Ollama query analysis timed out after ${OLLAMA_TIMEOUT_MS}ms`,
      );
    }

    throw error;
  } finally {
    console.timeEnd(timerLabel);
  }
}

function normalizeQueryAnalysisOutput(
  output: Record<string, unknown>,
): Record<string, unknown> {
  if (
    output.status === "greeting" ||
    output.status === "thanks" ||
    output.status === "farewell" ||
    output.status === "capabilities"
  ) {
    return {
      ...output,
      status: "conversation",
      intent: output.status,
    };
  }

  return output;
}

export async function analyzeQuery(
  query: string,
  signal?: AbortSignal,
): Promise<ValidatedRetrievalPlan> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    throw new Error("Query cannot be empty");
  }

  if (signal?.aborted) {
    throw new Error(
      "Query analysis aborted because the client disconnected",
    );
  }

  let lastError: unknown;

  for (
    let attempt = 1;
    attempt <= MAX_ATTEMPTS;
    attempt++
  ) {
    /*
     * Never start another retry after the client disconnected.
     */
    if (signal?.aborted) {
      throw new Error(
        "Query analysis aborted because the client disconnected",
      );
    }

    try {
      const llmOutput =
        await callOllama(
          normalizedQuery,
          attempt,
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

      const normalizedOutput =
        normalizeQueryAnalysisOutput(
          llmOutput as Record<string, unknown>,
        );

      return retrievalPlanSchema.parse({
        ...normalizedOutput,
        query: normalizedQuery,
      });
    } catch (error) {

      if (signal?.aborted) {
        throw new Error(
          "Query analysis aborted because the client disconnected",
        );
      }

      lastError = error;

      if (attempt < MAX_ATTEMPTS) {
        console.warn(
          `analyzeQuery attempt ${attempt} failed, retrying:`,
          error instanceof Error
            ? error.message
            : error,
        );
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(
      "Ollama query analysis failed after retries",
    );
}