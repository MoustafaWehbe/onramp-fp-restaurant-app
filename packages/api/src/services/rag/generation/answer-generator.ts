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

function buildPrompt(
    question: string,
    context: string
): string {
    return `
You are Platera's restaurant assistant.

Your task is to answer the user's question using ONLY the
information explicitly provided in the retrieved context.

IMPORTANT:
The context contains information retrieved from Platera's
database and search system. Treat it as the only source of truth.

Rules:

1. NEVER invent information.
   Do not create restaurants, branches, cuisines, prices,
   ratings, menus, menu items, locations, opening hours,
   availability, distances, descriptions, or any other facts.

2. NEVER assume or infer information that is not explicitly
   present in the context.

3. Only mention a fact if that fact appears in the context.

4. If the user asks for restaurants in a specific location,
   return restaurants from the context that match that location.
   Do not invent additional restaurants.

5. If the context contains matching restaurants, present them
   clearly and concisely.

6. If the context does not contain enough information to answer
   the question, say:
   "I don't have enough information to answer that."

7. If no matching restaurants were retrieved, say that no
   matching restaurants were found.

8. If the user asks for recommendations, explain why a restaurant
   matches ONLY using attributes explicitly present in the context.

9. Do not claim that a restaurant is open, closed, nearby,
   highly rated, cheap, expensive, romantic, cozy, etc. unless
   that information is explicitly present in the context.

10. Do not compare restaurants using information that is not
    explicitly provided.

11. Do not mention:
    - retrieval
    - embeddings
    - vectors
    - database queries
    - context
    - semantic search
    - internal implementation
    - the LLM

12. Keep the response concise, natural, and useful.

Context:
${context}

User question:
${question}

Answer:
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