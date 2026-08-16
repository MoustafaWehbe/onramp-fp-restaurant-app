import { Card } from "@/components/ui/card";
import type { MenuItem } from "@/types/menu";

import { EditMenuItemForm } from "./EditMenuItemForm";
import { MenuItemCard } from "./MenuItemCard";

interface MenuItemsGridProps {
  items?: MenuItem[];
  editingItemId: string | null;
  onEdit: (itemId: string) => void;
  onCancelEdit: () => void;
  onSubmitEdit: (itemId: string, formData: FormData) => void;
  isSubmitting: boolean;
}

export function MenuItemsGrid({
  items,
  editingItemId,
  onEdit,
  onCancelEdit,
  onSubmitEdit,
  isSubmitting,
}: MenuItemsGridProps) {
  if (!items?.length) {
    return (
      <Card className="rounded-2xl border-[#EAE4DC] bg-white p-8 text-center text-sm text-[#78716C]">
        No items in this menu yet.
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) =>
        editingItemId === item.id ? (
          <EditMenuItemForm
            key={item.id}
            item={item}
            onCancel={onCancelEdit}
            onSubmit={(formData) => onSubmitEdit(item.id, formData)}
            isSubmitting={isSubmitting}
          />
        ) : (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={() => onEdit(item.id)}
          />
        ),
      )}
    </div>
  );
}
