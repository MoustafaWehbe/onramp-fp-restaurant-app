import { Worker } from "bullmq";
import { QUEUE_NAMES, type EmailJobData } from "@fp_restaurant/shared/queue/types";
import { getRedisConnection } from "@fp_restaurant/shared/queue/client";
import { processEmailJob } from "./processor";

const connection = getRedisConnection();

connection.on("connect", () => {
  console.log("Redis connected");
});

connection.on("error", (err) => {
  console.error("Redis error", err);
});

const worker = new Worker<EmailJobData>(
    QUEUE_NAMES.EMAIL,
    processEmailJob,
    {
        connection: connection,
    }
);

worker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(
    `Email job ${job?.id} failed:`,
    error
  );
});

console.log("Email worker started");