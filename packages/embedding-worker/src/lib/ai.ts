import { Ollama } from "ollama";

const ollama = new Ollama({
  host: process.env.OLLAMA_URL ?? "http://localhost:11434",
});

const EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL ?? "nomic-embed-text";

export async function generateEmbedding(text: string): Promise<number[]> {
    if (!text.trim()) {
        throw new Error("cannot generate embedding for empty text");
    }

    let response;
    try {
        response = await ollama.embed({
            model: EMBEDDING_MODEL,
            input: text,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to generate embedding via ${EMBEDDING_MODEL}: ${message}`);
    }

    const embedding = response.embeddings[0];

    if (!embedding) {
        throw new Error("Ollama returned an empty embedding");
    }

    return embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!texts.length) {
        return [];
    }

    const emptyIndex = texts.findIndex((t) => !t.trim());
    if (emptyIndex !== -1) {
        throw new Error(`cannot generate embedding for empty text at index ${emptyIndex}`);
    }

    let response;
    try {
        response = await ollama.embed({
            model: EMBEDDING_MODEL,
            input: texts,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to generate embeddings via ${EMBEDDING_MODEL}: ${message}`);
    }

    if (response.embeddings.length !== texts.length) {
        throw new Error(
            `Ollama returned ${response.embeddings.length} embeddings for ${texts.length} inputs`
        );
    }

    return response.embeddings;
}