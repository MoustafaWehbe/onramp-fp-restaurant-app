import type { Job } from "bullmq";
import { jobHandlers } from "./handlers/job.handler.js";
import type { IndexJobData, JobName } from "./types/jobs.js";

export async function processor(job: Job<IndexJobData>): Promise<void> {
    const handler = jobHandlers[job.name as JobName];

    if (!handler) {
        throw new Error(`Unsupported embedding job type: ${job.name}`);
    }

    try {
        await handler(job);
    } catch (error) {
        console.error(`Failed to process embedding job ${job.name} (${job.id})`, {
            data: job.data,
            error,
        });

        throw error;
    }
}