export interface AnswerGeneratorInput {
    question: string;
    context: string;
    onChunk?: (
        chunk: string
    ) => void | Promise<void>;
}

export interface AnswerGeneratorResult {
    answer: string;
}

const OLLAMA_BASE_URL =
    process.env.OLLAMA_BASE_URL ??
    "http://localhost:11434";

const OLLAMA_MODEL =
    process.env.OLLAMA_MODEL ??
    "llama3.2";

const ANSWER_POLICY = `
You are Platera, a friendly and enthusiastic restaurant assistant.

Your goal is to help users discover restaurants and make decisions about
where to eat.

Use ONLY the information provided in the context.
The context is the source of truth.

STYLE:

- Speak like a helpful local restaurant guide.
- Be warm, friendly, and inviting.
- Make users excited to explore the restaurants you suggest.
- Avoid sounding like a database or search engine.
- Do not just list data; present restaurants naturally.
- Add a short helpful introduction before recommendations.
- When appropriate, end with a friendly suggestion.

ACCURACY RULES:

- Never invent restaurant details.
- Never create descriptions, dishes, experiences, locations, prices,
  ratings, or reviews that are not in the context.
- Only mention qualities explicitly available in the context.
- Do not claim a restaurant is "the best", "amazing", "perfect", etc.
  unless the context supports that.

RESTAURANT RECOMMENDATIONS:

When presenting restaurants:

- Introduce them naturally.

Example:

"I found a few places that could match what you're looking for:"

- Highlight useful details:
  - cuisine
  - price range
  - rating
  - reviews
  - location
  - ambiance
  - menu information

- Make each recommendation feel personalized.

Example:

"Block, Harber and Willms could be a nice option if you're in the mood
for Italian food. It has an Italian cuisine type, an average price range,
and a 4.12 rating."

LIST FORMAT:

For multiple restaurants:

"Here are a few restaurants you might like:

🍽️ Restaurant Name
- Cuisine:
- Price:
- Rating:
- Location:

..."

Keep lists easy to scan.

LIMITS:

- Return at most 5 restaurants unless the user asks for more.
- Do not overwhelm the user with unnecessary details.

WHEN INFORMATION IS MISSING:

If nothing relevant was found:
"I couldn't find restaurants matching your request right now."

If some details are missing:
Only mention the details that are available.

NEVER mention:
- retrieval
- embeddings
- vectors
- database
- context
- semantic search
- AI
- internal systems

Remember:
You are helping someone choose where to eat, not displaying search results.
`;

function buildPrompt(
    question: string,
    context: string
): string {
    return `
<CONTEXT>
${context}
</CONTEXT>

<USER_QUESTION>
${question}
</USER_QUESTION>

<ANSWER>
`.trim();
}


export async function generateAnswer({
    question,
    context,
    onChunk,
}: AnswerGeneratorInput): Promise<AnswerGeneratorResult> {
    const prompt = buildPrompt(
        question,
        context
    );

    const response = await fetch(
        `${OLLAMA_BASE_URL}/api/generate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                system: ANSWER_POLICY,
                prompt,
                stream: true,
            }),
        }
    );

    if (!response.ok) {
        const errorText =
            await response.text();

        throw new Error(
            `Ollama generation failed: ${response.status} ${errorText}`
        );
    }

    if (!response.body) {
        throw new Error(
            "Ollama response does not contain a stream"
        );
    }

    const reader =
        response.body.getReader();

    const decoder =
        new TextDecoder();

    let answer = "";
    let buffer = "";

    while (true) {
        const { value, done } =
            await reader.read();

        if (done) {
            break;
        }

        buffer += decoder.decode(
            value,
            { stream: true }
        );

        const lines =
            buffer.split("\n");

        buffer =
            lines.pop() ?? "";

        for (const line of lines) {
            if (!line.trim()) {
                continue;
            }

            let data: {
                response?: string;
                done?: boolean;
            };

            try {
                data = JSON.parse(line);
            } catch (error) {
                console.warn(
                    "Failed to parse Ollama stream chunk:",
                    line,
                    error
                );
                continue;
            }

            const chunk =
                data.response ?? "";

            if (!chunk) {
                continue;
            }

            answer += chunk;

            if (onChunk) {
                await onChunk(chunk);
            }
        }
    }

    /*
     * Process any remaining buffered data.
     */
    if (buffer.trim()) {
        try {
            const data = JSON.parse(buffer);

            const chunk =
                data.response ?? "";

            if (chunk) {
                answer += chunk;

                if (onChunk) {
                    await onChunk(chunk);
                }
            }
        } catch (error) {
            console.warn(
                "Failed to parse trailing Ollama stream data:",
                buffer,
                error
            );
        }
    }

    return {
        answer,
    };
}