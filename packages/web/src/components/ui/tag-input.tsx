import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
}

export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Add a tag...",
  maxTags,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (rawValue: string) => {
    const tag = rawValue.trim();

    if (!tag) {
      return;
    }

    if (maxTags !== undefined && value.length >= maxTags) {
      setInputValue("");
      return;
    }

    const exists = value.some(
      (existingTag) =>
        existingTag.toLowerCase() === tag.toLowerCase(),
    );

    if (exists) {
      setInputValue("");
      return;
    }

    onChange([...value, tag]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(
      value.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();
      addTag(inputValue);
      return;
    }

    if (
      event.key === "Backspace" &&
      inputValue === "" &&
      value.length > 0
    ) {
      onChange(value.slice(0, -1));
    }
  };

  const visibleSuggestions = suggestions.filter(
    (suggestion) =>
      !value.some(
        (tag) =>
          tag.toLowerCase() ===
          suggestion.toLowerCase(),
      ),
  );

  return (
    <div className="space-y-3">
      <div className="min-h-12 rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] px-3 py-2 transition-colors focus-within:border-primary/40">
        <div className="flex flex-wrap items-center gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#EAE4DC] bg-white px-3 py-1.5 text-xs text-[#57534E]"
            >
              {tag}

              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-[#A8A29E] transition-colors hover:text-[#292524]"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}

          <input
            type="text"
            value={inputValue}
            onChange={(event) =>
              setInputValue(event.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={
              maxTags !== undefined &&
              value.length >= maxTags
            }
            placeholder={
              value.length === 0
                ? placeholder
                : "Add another..."
            }
            className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm text-[#292524] outline-none placeholder:text-[#A8A29E] disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {visibleSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {visibleSuggestions.map(
            (suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() =>
                  addTag(suggestion)
                }
                disabled={
                  maxTags !== undefined &&
                  value.length >= maxTags
                }
                className="rounded-full border border-[#EAE4DC] bg-white px-3 py-1.5 text-xs text-[#78716C] transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                + {suggestion}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}