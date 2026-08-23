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
        w-96
        h-[500px]
        bg-white
        rounded-2xl
        shadow-2xl
        z-50
        flex
        flex-col
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