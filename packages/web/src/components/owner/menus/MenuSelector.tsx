import type { Menu } from "@/types/menu";

interface MenuSelectorProps {
  menus: Menu[];
  selectedMenuId: string | null;
  onSelect: (menuId: string) => void;
}

export function MenuSelector({
  menus,
  selectedMenuId,
  onSelect,
}: MenuSelectorProps) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
      {menus.map((menu) => (
        <button
          key={menu.id}
          type="button"
          onClick={() => onSelect(menu.id)}
          className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
            menu.id === selectedMenuId
              ? "border-[#292524] bg-[#292524] text-white"
              : "border-[#EAE4DC] bg-white text-[#57534E] hover:border-[#D6D3D1]"
          }`}
        >
          {menu.name}
        </button>
      ))}
    </div>
  );
}
