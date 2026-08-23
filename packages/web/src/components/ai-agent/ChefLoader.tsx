type Props = {
  status?: string;
};

export function ChefLoader({ status }: Props) {
  return (
    <div
      className="
        bg-gray-100
        rounded-2xl
        px-4
        py-3
        flex
        items-center
        gap-3
        w-fit
      "
    >
      <div
        className="
          text-2xl
          animate-bounce
        "
      >
        👨‍🍳
      </div>

      <div>
        <div className="flex items-center gap-1 font-medium text-sm">
          <span>
            Chef is cooking
          </span>

          <span className="flex items-end h-5">
            <span className="animate-bounce [animation-delay:0ms]">
              .
            </span>

            <span className="animate-bounce [animation-delay:150ms]">
              .
            </span>

            <span className="animate-bounce [animation-delay:300ms]">
              .
            </span>
          </span>
        </div>

        {status && (
          <p className="text-xs text-gray-500 mt-1">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}