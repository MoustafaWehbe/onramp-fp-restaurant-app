import { Worker } from "bullmq";
import { getRedisConnection, QUEUE_NAMES } from "@fp_restaurant/shared";
import { processor } from "./processor.js";

const connection = getRedisConnection();

const worker = new Worker(
    QUEUE_NAMES.EMBEDDINGS,
    processor,
    {
        connection,
        concurrency: 5,
    },
);

worker.on("ready", () => {
    console.info("[embedding-worker] Worker is ready");
});

worker.on("completed", (job) => {
    console.info(
        `[embedding-worker] Job ${job.id} (${job.name}) completed`,
    );
});

worker.on("failed", (job, error) => {
    console.error(
        `[embedding-worker] Job ${job?.id} (${job?.name}) failed:`,
        error,
    );
});

worker.on("error", (error) => {
    console.error("[embedding-worker] Worker error:", error);
});

async function shutdown(signal: string): Promise<void> {
    console.info(`[embedding-worker] Received ${signal}, shutting down...`);

    try {
        await worker.close();
        console.info("[embedding-worker] Worker shut down successfully");
        process.exit(0);
    } catch (error) {
        console.error("[embedding-worker] Failed to shut down worker:", error);
        process.exit(1);
    }
}

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

console.info("[embedding-worker] Starting worker...");