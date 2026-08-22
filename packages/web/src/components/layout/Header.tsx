import { Bookmark, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FAVORITE_ADDED_EVENT } from "@/lib/favorite-events";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const [isBookmarkAnimating, setIsBookmarkAnimating] = useState(false);

  useEffect(() => {
    const handleFavoriteAdded = () => {
      setIsBookmarkAnimating(false);

      // Force the animation to restart every time.
      requestAnimationFrame(() => {
        setIsBookmarkAnimating(true);
      });

      const timeout = window.setTimeout(() => {
        setIsBookmarkAnimating(false);
      }, 1500);

      return () => window.clearTimeout(timeout);
    };

    window.addEventListener(
      FAVORITE_ADDED_EVENT,
      handleFavoriteAdded
    );

    return () => {
      window.removeEventListener(
        FAVORITE_ADDED_EVENT,
        handleFavoriteAdded
      );
    };
  }, []);

  return (
    <header className="flex h-16 items-center border-b px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 hover:bg-muted"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <Link to= "/home">
        <h1 className="ml-4 text-2xl font-bold text-primary">
          Platera
        </h1>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        {isBookmarkAnimating && (
          <span
            className="
              animate-saved-label
              rounded-full
              bg-primary/10
              px-3 py-1
              text-sm font-medium
              text-primary
            "
          >
            Saved!
          </span>
        )}

        <button
          onClick={() => navigate("/saved-restaurants")}
          className={`
            rounded-full p-2
            transition-colors
            hover:bg-muted
            ${
              isBookmarkAnimating
                ? "bg-primary/10 text-primary"
                : ""
            }
          `}
          aria-label="Saved restaurants"
        >
          <Bookmark
            className={`
              h-6 w-6
              ${
                isBookmarkAnimating
                  ? "animate-bookmark-notification"
                  : ""
              }
            `}
          />
        </button>
      </div>
    </header>
  );
}