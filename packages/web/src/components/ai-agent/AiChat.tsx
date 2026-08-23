import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { useAiChat } from "@/hooks/useAiChat";
import { ChefLoader } from "./ChefLoader";

type Props = {
  onClose: () => void;
};

export function AiChat({ onClose }: Props) {
  const {
    messages,
    loading,
    sendMessage,
    clearMessages,
    status,
  } = useAiChat();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      className="
      fixed
      bottom-32
      right-6
      z-50
      flex
      h-[720px]
      w-[650px]
      max-h-[calc(100vh-9rem)]
      max-w-[calc(100vw-3rem)]
      flex-col
      overflow-hidden
      rounded-2xl
      bg-white
      shadow-2xl
    "
    >
      <ChatHeader
        onClose={onClose}
        onClear={clearMessages}
      />

      <div
        className="
          flex-1
          overflow-y-auto
          p-4
          space-y-3
        "
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}

        {loading && (
          <ChefLoader status={status} />
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={sendMessage}
        loading={loading}
      />
    </div>
  );
}