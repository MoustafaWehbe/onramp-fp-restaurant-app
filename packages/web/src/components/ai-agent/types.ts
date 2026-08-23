export type MessageRole = "user" | "assistant";

export type ChatMessageType = {
  id: string;
  role: MessageRole;
  content: string;
};