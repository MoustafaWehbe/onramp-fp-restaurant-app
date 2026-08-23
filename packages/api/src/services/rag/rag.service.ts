import type { ValidatedRetrievalPlan } from "./query/query-schema";
import { analyzeQuery } from "./query/query-analyzer";
import { databaseRetrieval } from "./retrieval/database-retrieval";
import { semanticRetrieval } from "./retrieval/semantic-retrieval";
import { hybridRetrieval } from "./retrieval/hybrid-retrieval";
import { buildContext } from "./context/context-builder";
import { generateAnswer } from "./generation/answer-generator";
import { generateEmbedding } from "@fp_restaurant/shared";

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
    signal?: AbortSignal;
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
    question: string,
    signal?: AbortSignal,
): Promise<number[]> {
    return generateEmbedding(question, signal);
}

async function executeRetrieval(
    plan: ValidatedRetrievalPlan,
    question: string,
    signal?: AbortSignal,
) {
    switch (plan.retrievalType) {
        case "database":
            return databaseRetrieval(plan);

        case "semantic": {
            const embedding =
                await createQueryEmbedding(
                    question,
                    signal,
                );

            return semanticRetrieval(
                embedding,
            );
        }

        case "hybrid": {
            const embedding =
                await createQueryEmbedding(
                    question,
                    signal,
                );

            return hybridRetrieval(
                plan,
                embedding,
            );
        }

        default:
            throw new Error(
                `Unsupported retrieval strategy: ${String(
                    plan.retrievalType,
                )}`,
            );
    }
}

function getConversationResponse(
    intent: NonNullable<ValidatedRetrievalPlan["intent"]>,
): string {
    switch (intent) {
        case "greeting":
            return "Hello! 👋 How can I help you find a restaurant today?";

        case "thanks":
            return "You're very welcome! 😊";

        case "farewell":
            return "Goodbye! 👋 Hope to see you again soon!";

        case "capabilities":
            return "I can help you find restaurants, cuisines, menus, dishes, prices, ratings, locations, opening hours, and restaurants based on your preferences.";

        default:
            return "Hello! 👋 How can I help you today?";
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
        await analyzeQuery(question, options.signal);

    if (plan.status === "conversation") {
        if (!plan.intent) {
            throw new Error(
                "Conversation intent is missing from the query plan",
            );
        }

        const answer = getConversationResponse(plan.intent);

        await options.onEvent?.({
            type: "answer_chunk",
            content: answer,
        });
        
        await options.onChunk?.(answer);

        await options.onEvent?.({
            type: "completed",
        });

        return {
            answer,
            plan,
            context: "",
            retrievalResults: [],
        };
    }

    if (plan.status === "irrelevant") {
        const answer =
            "Sorry, I can only help with restaurant-related questions. 🍽️";

        await options.onEvent?.({
            type: "answer_chunk",
            content: answer,
        });

        await options.onEvent?.({
            type: "completed",
        });

        return {
            answer,
            plan,
            context: "",
            retrievalResults: [],
        };
    }

    await options.onEvent?.({
        type: "retrieving",
    });
    const retrievalResults =
        await executeRetrieval(
            plan,
            question,
            options.signal,
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
            signal: options.signal,
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