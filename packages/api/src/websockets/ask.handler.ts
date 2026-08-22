import type { IncomingMessage } from "http";
import type { Server as HttpServer } from "http";
import { WebSocket, WebSocketServer } from "ws";

import {
  answerQuestion,
  type RagProgressEvent,
} from "../services/rag/rag.service";

interface AskMessage {
  type: "ask";
  question: string;
}

function send(
  socket: WebSocket,
  event: RagProgressEvent,
): void {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(JSON.stringify(event));
}

function sendError(
  socket: WebSocket,
  message: string,
): void {
  send(socket, {
    type: "error",
    message,
  });
}

function isAskMessage(
  message: unknown,
): message is AskMessage {
  if (
    typeof message !== "object" ||
    message === null
  ) {
    return false;
  }

  const value = message as Record<string, unknown>;

  return (
    value.type === "ask" &&
    typeof value.question === "string"
  );
}

async function handleAsk(
  socket: WebSocket,
  message: AskMessage,
): Promise<void> {
  const question = message.question.trim();

  if (!question) {
    sendError(socket, "Question cannot be empty");
    return;
  }

  try {
    await answerQuestion(question, {
      onEvent: async (event) => {
        send(socket, event);
      },
    });
  } catch (error) {
    console.error(
      "WebSocket RAG error:",
      error,
    );

    sendError(
      socket,
      error instanceof Error
        ? error.message
        : "Failed to process question",
    );
  }
}

export function registerAskWebSocket(
  server: HttpServer,
): WebSocketServer {
  const webSocketServer =
    new WebSocketServer({
      server,
      path: "/ws/ask",
    });

  webSocketServer.on(
    "connection",
    (
      socket: WebSocket,
      _request: IncomingMessage,
    ) => {
      socket.on("message", async (data) => {
        try {
          const message: unknown =
            JSON.parse(data.toString());

          if (!isAskMessage(message)) {
            sendError(
              socket,
              "Invalid WebSocket message",
            );
            return;
          }

          await handleAsk(socket, message);
        } catch (error) {
          console.error(
            "WebSocket message error:",
            error,
          );

          sendError(
            socket,
            "Invalid message format",
          );
        }
      });

      socket.on("error", (error) => {
        console.error(
          "WebSocket connection error:",
          error,
        );
      });
    },
  );

  return webSocketServer;
}