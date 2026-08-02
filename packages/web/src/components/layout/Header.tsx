import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 items-center border-b px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 hover:bg-muted"
      >
        <Menu className="h-6 w-6" />
      </button>

      <h1 className="ml-4 text-2xl font-bold text-primary">
        Platera
      </h1>
    </header>
  );
}