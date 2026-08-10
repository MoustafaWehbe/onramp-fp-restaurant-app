import { Bookmark, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex h-16 items-center border-b px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 hover:bg-muted"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <h1 className="ml-4 text-2xl font-bold text-primary">
        Platera
      </h1>

      <button
        onClick={() => navigate("/saved-restaurants")}
        className="ml-auto rounded-md p-2 hover:bg-muted"
        aria-label="Saved restaurants"
      >
        <Bookmark className="h-6 w-6" />
      </button>
    </header>
  );
}