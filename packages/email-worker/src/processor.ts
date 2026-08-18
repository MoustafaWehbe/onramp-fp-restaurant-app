import { Job } from "bullmq";
import type { EmailJobData } from "@fp_restaurant/shared/queue/types";
import { emailHandlerRegistry } from "./registry/email-handler.registry";

export async function processEmailJob(job: Job<EmailJobData>): Promise<void> {
    const handler = emailHandlerRegistry.get(job.data.type);

    if(!handler) {
        throw new Error(`No handler found for email type ${job.data.type}`);
    }

    await handler.handle(job.data);
}