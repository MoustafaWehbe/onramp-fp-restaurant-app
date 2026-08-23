type Props = {
  role: "user" | "assistant";
  content: string;
};

export function ChatMessage({
  role,
  content,
}: Props) {
  return (
    <div
      className={`
        max-w-[80%]
        rounded-xl
        p-3
        text-sm
        whitespace-pre-line
        ${
          role === "user"
            ? "ml-auto bg-primary text-white"
            : "bg-gray-100"
        }
      `}
    >
      {content}
    </div>
  );
}