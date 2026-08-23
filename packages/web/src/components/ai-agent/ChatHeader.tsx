type Props = {
  onClose: () => void;
  onClear: () => void;
};

export function ChatHeader({
  onClose,
  onClear,
}: Props) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        p-4
        border-b
        bg-white
        rounded-t-2xl
      "
    >
      {/* Assistant identity */}
      <div className="flex items-center gap-3">
        <div
          className="
            relative
            flex
            items-center
            justify-center
            w-10
            h-10
            rounded-full
            bg-orange-100
            text-2xl
          "
        >
          👨‍🍳

          <span
            className="
              absolute
              bottom-0
              right-0
              w-3
              h-3
              bg-green-500
              rounded-full
              border-2
              border-white
            "
          />
        </div>

        <div>
          <h2
            className="
              font-semibold
              text-gray-800
            "
          >
            Chef Assistant
          </h2>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Ready to help you 🍽️
          </p>
        </div>
      </div>


      {/* Actions */}
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        {/* Clear chat */}
        <button
          onClick={onClear}
          title="Clear chat"
          className="
            p-2
            rounded-lg
            text-gray-400
            hover:text-red-500
            hover:bg-red-50
            transition
          "
        >
          🗑️
        </button>


        {/* Close */}
        <button
          onClick={onClose}
          title="Close assistant"
          className="
            p-2
            rounded-lg
            text-gray-400
            hover:text-black
            hover:bg-gray-100
            transition
          "
        >
          ✕
        </button>
      </div>
    </div>
  );
}