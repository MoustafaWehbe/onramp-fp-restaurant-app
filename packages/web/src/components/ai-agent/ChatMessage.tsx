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
        w-fit
        max-w-[80%]
        rounded-xl
        px-4
        py-2.5
        text-sm
        whitespace-pre-line
        break-words
        ${role === "user"
          ? "ml-auto bg-primary text-white"
          : "bg-gray-100"
        }
      `}
    >
      {content}
    </div>
  );
}