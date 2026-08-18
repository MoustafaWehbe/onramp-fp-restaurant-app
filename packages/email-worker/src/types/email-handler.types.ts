import type { EmailJobData } from "@fp_restaurant/shared/queue/types";

export interface EmailHandler {
    handle(data: EmailJobData): Promise<void>;
}