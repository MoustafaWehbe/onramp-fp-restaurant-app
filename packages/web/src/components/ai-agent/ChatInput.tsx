import { useState } from "react";

type Props = {
  onSend: (message: string) => void;
  loading: boolean;
};

export function ChatInput({
  onSend,
  loading,
}: Props) {
  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim() || loading) return;

    onSend(input.trim());
    setInput("");
  }

  return (
    <div
      className="
        border-t
        p-3
        flex
        gap-2
      "
    >
      <textarea
        value={input}
        disabled={loading}
        onChange={(e) =>
          setInput(e.target.value)
        }
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.shiftKey
          ) {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder="Ask me anything..."
        rows={1}
        className="
          flex-1
          border
          rounded-lg
          px-3
          py-2
          resize-none
          disabled:opacity-50
        "
      />

      <button
        disabled={loading}
        onClick={sendMessage}
        className="
          px-4
          rounded-lg
          bg-primary
          text-white
          disabled:opacity-50
        "
      >
        Send
      </button>
    </div>
  );
}