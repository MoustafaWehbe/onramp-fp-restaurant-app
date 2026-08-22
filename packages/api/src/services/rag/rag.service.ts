import type { ValidatedRetrievalPlan } from "./query/query-schema";

import {
    analyzeQuery,
} from "./query/query-analyzer";

import {
    databaseRetrieval,
} from "./retrieval/database-retrieval";

import {
    semanticRetrieval,
} from "./retrieval/semantic-retrieval";

import {
    hybridRetrieval,
} from "./retrieval/hybrid-retrieval";

import {
    buildContext,
} from "./context/context-builder";

import {
    generateAnswer,
} from "./generation/answer-generator";

import {
    generateEmbedding,
} from "@fp_restaurant/shared";

export type RagChunkHandler = (
    chunk: string
) => void | Promise<void>;

export type RagProgressEvent =
    | {
        type: "query_analyzing";
    }
    | {
        type: "retrieving";
    }
    | {
        type: "context_ready";
    }
    | {
        type: "answer_chunk";
        content: string;
    }
    | {
        type: "completed";
    }
    | {
        type: "error";
        message: string;
    };

export interface RagAnswerOptions {
    onChunk?: RagChunkHandler;
    onEvent?: (
        event: RagProgressEvent,
    ) => void | Promise<void>;
}

export interface RagAnswerResult {
    answer: string;
    plan: ValidatedRetrievalPlan;
    context: string;
    retrievalResults: unknown;
}

async function createQueryEmbedding(
    question: string
): Promise<number[]> {
    return generateEmbedding(question);
}

async function executeRetrieval(
    plan: ValidatedRetrievalPlan,
    question: string
) {
    switch (plan.retrievalType) {
        case "database":
            return databaseRetrieval(plan);

        case "semantic": {
            const embedding =
                await createQueryEmbedding(
                    question
                );

            return semanticRetrieval(
                embedding
            );
        }

        case "hybrid": {
            const embedding =
                await createQueryEmbedding(
                    question
                );

            return hybridRetrieval(
                plan,
                embedding
            );
        }

        default:
            throw new Error(
                `Unsupported retrieval strategy: ${String(
                    plan.retrievalType
                )}`
            );
    }
}

export async function answerQuestion(
    question: string,
    options: RagAnswerOptions = {}
): Promise<RagAnswerResult> {
    if (!question?.trim()) {
        throw new Error(
            "Question cannot be empty"
        );
    }
    await options.onEvent?.({
        type: "query_analyzing",
    });

    const plan =
        await analyzeQuery(question);

    await options.onEvent?.({
        type: "retrieving",
    });

    const retrievalResults =
        await executeRetrieval(
            plan,
            question
        );

    const context =
        buildContext(
            retrievalResults as any
        );

    await options.onEvent?.({
        type: "context_ready",
    });

    const generationResult =
        await generateAnswer({
            question,
            context,
            onChunk: async (chunk) => {
                await options.onEvent?.({
                    type: "answer_chunk",
                    content: chunk,
                });

                await options.onChunk?.(chunk);
            },
        });

    await options.onEvent?.({
        type: "completed",
    });

    return {
        answer:
            generationResult.answer,

        plan,

        context,

        retrievalResults,
    };
}