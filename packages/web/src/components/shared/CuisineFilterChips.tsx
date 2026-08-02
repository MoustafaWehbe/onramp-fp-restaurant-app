import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CuisineFilterChipsProps {
  cuisines: readonly string[];
  activeCuisine?: string | null;
  onSelect?: (cuisine: string) => void;
}

/**
 * Row of tappable cuisine chips. Purely presentational: the parent owns
 * selection state so this can drive either the hero's quick filters or a
 * future search/filter sidebar.
 */
export function CuisineFilterChips({
  cuisines,
  activeCuisine,
  onSelect,
}: CuisineFilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {cuisines.map((cuisine) => {
        const isActive = cuisine === activeCuisine;
        return (
          <Badge
            key={cuisine}
            variant={isActive ? "default" : "secondary"}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            onClick={() => onSelect?.(cuisine)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.(cuisine);
              }
            }}
            className={cn(
              "cursor-pointer select-none rounded-full px-4 py-1.5 text-sm font-normal",
              "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            {cuisine}
          </Badge>
        );
      })}
    </div>
  );
}
