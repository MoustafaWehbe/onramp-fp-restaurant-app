import { Ollama } from "ollama";

const OLLAMA_TIMEOUT_MS = Number(
    process.env.OLLAMA_TIMEOUT_MS ?? 30000,
);
const EMBEDDING_DIMENSION = 768;

function createTimeoutFetch(
    timeoutMs: number,
    externalSignal?: AbortSignal,
): typeof fetch {
    return async (input, init = {}) => {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
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
                    { once: true },
                );
            }
        }

        try {
            return await fetch(input, {
                ...init,
                signal: controller.signal,
            });
        } finally {
            clearTimeout(timeout);

            externalSignal?.removeEventListener(
                "abort",
                abortHandler,
            );
        }
    };
}

const ollama = new Ollama({
    host:
        process.env.OLLAMA_BASE_URL ??
        "http://localhost:11434",
    fetch: createTimeoutFetch(
        OLLAMA_TIMEOUT_MS,
    ),
});

const EMBEDDING_MODEL =
    process.env.OLLAMA_EMBEDDING_MODEL ??
    "nomic-embed-text";

function validateEmbedding(
    vector: unknown,
): vector is number[] {
    if (!Array.isArray(vector)) {
        return false;
    }

    if (vector.length !== EMBEDDING_DIMENSION) {
        return false;
    }

    return vector.every(
        (value) =>
            typeof value === "number" &&
            Number.isFinite(value),
    );
}

export async function generateEmbedding(
    text: string,
    signal?: AbortSignal,
): Promise<number[]> {
    if (!text.trim()) {
        throw new Error(
            "Cannot generate embedding for empty text",
        );
    }

    if (signal?.aborted) {
        throw new Error(
            "Embedding generation aborted",
        );
    }

    const client = signal
        ? new Ollama({
            host:
                process.env.OLLAMA_BASE_URL ??
                "http://localhost:11434",
            fetch: createTimeoutFetch(
                OLLAMA_TIMEOUT_MS,
                signal,
            ),
        })
        : ollama;

    let response;

    try {
        response = await client.embed({
            model: EMBEDDING_MODEL,
            input: text,
        });
    } catch (error) {
        if (signal?.aborted) {
            throw new Error(
                "Embedding generation aborted because the client disconnected",
            );
        }

        const message =
            error instanceof Error
                ? error.message
                : String(error);

        throw new Error(
            `Failed to generate embedding via ${EMBEDDING_MODEL}: ${message}`,
        );
    }

    if (!Array.isArray(response.embeddings)) {
        throw new Error(
            "Ollama returned an invalid embeddings payload",
        );
    }

    if (response.embeddings.length !== 1) {
        throw new Error(
            `Expected 1 embedding, received ${response.embeddings.length}`,
        );
    }

    const embedding = response.embeddings[0];

    if (!validateEmbedding(embedding)) {
        throw new Error(
            `Invalid embedding vector. Expected ${EMBEDDING_DIMENSION} numeric dimensions`,
        );
    }

    return embedding;
}

export async function generateEmbeddings(
    texts: string[],
): Promise<number[][]> {
    if (!texts.length) {
        return [];
    }

    const emptyIndex = texts.findIndex(
        (text) => !text.trim(),
    );

    if (emptyIndex !== -1) {
        throw new Error(
            `Cannot generate embedding for empty text at index ${emptyIndex}`,
        );
    }

    let response;

    try {
        response = await ollama.embed({
            model: EMBEDDING_MODEL,
            input: texts,
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : String(error);

        throw new Error(
            `Failed to generate embeddings via ${EMBEDDING_MODEL}: ${message}`,
        );
    }

    if (!Array.isArray(response.embeddings)) {
        throw new Error(
            "Ollama returned an invalid embeddings payload",
        );
    }

    if (response.embeddings.length !== texts.length) {
        throw new Error(
            `Expected ${texts.length} embeddings, received ${response.embeddings.length}`,
        );
    }

    const invalidIndex =
        response.embeddings.findIndex(
            (embedding) =>
                !validateEmbedding(embedding),
        );

    if (invalidIndex !== -1) {
        throw new Error(
            `Invalid embedding vector at index ${invalidIndex}. Expected ${EMBEDDING_DIMENSION} numeric dimensions`,
        );
    }

    return response.embeddings;
}

export function cosineSimilarity(
    a: number[],
    b: number[],
): number {
    if (a.length !== b.length) {
        throw new Error(
            "Vectors must have the same length",
        );
    }

    const dot = a.reduce(
        (sum, ai, i) =>
            sum + ai * (b[i] ?? 0),
        0,
    );

    const magA = Math.sqrt(
        a.reduce(
            (sum, ai) => sum + ai * ai,
            0,
        ),
    );

    const magB = Math.sqrt(
        b.reduce(
            (sum, bi) => sum + bi * bi,
            0,
        ),
    );

    if (magA === 0 || magB === 0) {
        return 0;
    }

    return dot / (magA * magB);
}