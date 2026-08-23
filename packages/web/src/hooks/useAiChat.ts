import { useState, useEffect, useRef } from "react";
import type { ChatMessageType as ChatMessage } from "@/components/ai-agent/types";
import { getSocket } from "@/services/socket";

const CHAT_STORAGE_KEY = "ai_agent_messages";

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);

    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch {
        localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    }

    return [
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Hello 👋 I am your restaurant assistant. How can I help you today?",
      },
    ];
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const socketRef = useRef<WebSocket | null>(null);

  if (!socketRef.current) {
    socketRef.current = getSocket();
  }

  const socket = socketRef.current;

  useEffect(() => {
    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify(messages),
    );
  }, [messages]);

  useEffect(() => {
    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("AI EVENT:", data);

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
        
        setTimeout(() => {
            setStatus("");
        }, 300);

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
    };

    return () => {
      // Do not close the socket.
      // The connection is shared and reused.
      socket.onmessage = null;
      socket.onerror = null;
      socket.onopen = null;
    };
  }, [socket]);

  function sendMessage(userMessage: string) {
    if (socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

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
      }),
    );
  }

  function clearMessages() {
    localStorage.removeItem(CHAT_STORAGE_KEY);

    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Hello 👋 I am your restaurant assistant. How can I help you today?",
      },
    ]);
  }

  return {
    messages,
    loading,
    status,
    sendMessage,
    clearMessages,
  };
}