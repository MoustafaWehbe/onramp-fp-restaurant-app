// ─── Queue names ───────────────────────────────────────────────────────────────
export const QUEUE_NAMES = {
  EMAIL: "email",
  EMBEDDINGS: "embeddings",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

// ─── Job data shapes ───────────────────────────────────────────────────────────
export interface EmailJobData {
  to: string;
  type: string;
  variables?: Record<string, string>; 
}

export type EmbeddingsJobData =
  | {
      restaurantId: string;
    }
  | {
      menuId: string;
    }
  | {
      menuItemId: string;
    };

export type JobData = EmailJobData | EmbeddingsJobData;

// ─── Job result shapes ─────────────────────────────────────────────────────────
export interface EmailJobResult {
  messageId: string;
}

export interface EmbeddingsJobResult {
  dimensions: number;
}
