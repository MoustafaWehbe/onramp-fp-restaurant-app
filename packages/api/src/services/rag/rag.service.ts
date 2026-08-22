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

export interface RagAnswerOptions {
    onChunk?: RagChunkHandler;
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

    /*
     * ---------------------------------------------------------
     * 1. Analyze the question
     * ---------------------------------------------------------
     */
    const plan =
        await analyzeQuery(question);

    /*
     * ---------------------------------------------------------
     * 2. Execute retrieval
     * ---------------------------------------------------------
     */
    const retrievalResults =
        await executeRetrieval(
            plan,
            question
        );
  
    /*
     * ---------------------------------------------------------
     * 3. Build clean LLM context
     * ---------------------------------------------------------
     */
    const context =
        buildContext(
            retrievalResults as any
        );
   
    /*
     * ---------------------------------------------------------
     * 4. Generate answer
     *
     * The generator streams chunks through the callback.
     * There is intentionally no WebSocket code here.
     * ---------------------------------------------------------
     */
    const generationResult =
        await generateAnswer({
            question,
            context,
            onChunk:
                options.onChunk,
        });

    /*
     * ---------------------------------------------------------
     * 5. Return complete result
     * ---------------------------------------------------------
     */
    return {
        answer:
            generationResult.answer,

        plan,

        context,

        retrievalResults,
    };
}