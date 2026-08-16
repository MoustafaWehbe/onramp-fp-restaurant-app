import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { MenuItem } from "@/types/menu";

import { MenuItemImage } from "./MenuItemImage";

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: () => void;
}

export function MenuItemCard({ item, onEdit }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border-[#EAE4DC] bg-white">
      <MenuItemImage src={item.image_url} alt={item.name} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg font-medium text-[#292524]">
            {item.name}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-sm font-semibold text-[#292524]">
              ${Number(item.base_price).toFixed(2)}
            </span>
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${item.name}`}
              className="text-[#A8A29E] hover:text-[#57534E]"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {item.description && (
          <p className="mt-1.5 text-sm leading-5 text-[#78716C]">
            {item.description}
          </p>
        )}
        {item.is_active === false && (
          <Badge variant="secondary" className="mt-3">
            Inactive
          </Badge>
        )}
      </div>
    </Card>
  );
}
