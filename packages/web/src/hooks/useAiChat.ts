import { useState, useEffect, useRef } from "react";
import type { ChatMessageType as ChatMessage } from "@/components/ai-agent/types";
import { getSocket } from "@/services/socket";

const CHAT_STORAGE_KEY = "ai_agent_messages";

function getDefaultMessages(): ChatMessage[] {
  return [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hello 👋 I am your restaurant assistant. How can I help you today?",
    },
  ];
}

function isValidChatMessages(value: unknown): value is ChatMessage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (message) =>
        typeof message === "object" &&
        message !== null &&
        typeof message.id === "string" &&
        (message.role === "assistant" || message.role === "user") &&
        typeof message.content === "string",
    )
  );
}

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);

        if (isValidChatMessages(parsedMessages)) {
          return parsedMessages;
        }

        localStorage.removeItem(CHAT_STORAGE_KEY);
      } catch {
        localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    }

    return getDefaultMessages();
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const socketRef = useRef<WebSocket | null>(null);
  const requestIdRef = useRef(0);

  if (!socketRef.current) {
    socketRef.current = getSocket();
  }

  const socket = socketRef.current;

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("AI EVENT:", data);

      if (
        data.requestId &&
        data.requestId !== requestIdRef.current
      ) {
        return;
      }

      if (data.type === "query_analyzing") {
        setStatus("Understanding your request...");
      }

      if (data.type === "retrieving") {
        setStatus("Searching restaurants and menus...");
      }

      if (data.type === "context_ready") {
        setStatus("Preparing your recommendation...");
      }

      if (data.type === "answer_chunk") {
        setLoading(false);
        
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];

          if (lastMessage?.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                content: lastMessage.content + data.content,
              },
            ];
          }

          return [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: data.content,
            },
          ];
        });
      }

      if (data.type === "completed") {
        setLoading(false);
        setStatus("");
      }

      if (data.type === "error") {
        setLoading(false);
        setStatus("");

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "Sorry 😔 I couldn't process your request.",
          },
        ]);

        console.error(data.message);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);

      setLoading(false);
      setStatus("");
    };

    return () => {
      socket.onmessage = null;
      socket.onerror = null;
      socket.onopen = null;
    };
  }, [socket]);

  function sendMessage(userMessage: string) {
    if (socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return false;
    }

    requestIdRef.current += 1;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: userMessage,
      },
    ]);

    setLoading(true);
    setStatus("Understanding your request...");

    socket.send(
      JSON.stringify({
        type: "ask",
        question: userMessage,
        requestId: requestIdRef.current,
      }),
    );

    return true;
  }

  function clearMessages() {
    requestIdRef.current += 1;

    localStorage.removeItem(CHAT_STORAGE_KEY);

    setLoading(false);
    setStatus("");

    setMessages(getDefaultMessages());
  }

  return {
    messages,
    loading,
    status,
    sendMessage,
    clearMessages,
  };
}