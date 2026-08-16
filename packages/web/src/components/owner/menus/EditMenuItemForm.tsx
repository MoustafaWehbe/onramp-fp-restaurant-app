import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { MenuItem } from "@/types/menu";

interface EditMenuItemFormProps {
  item: MenuItem;
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}

export function EditMenuItemForm({
  item,
  onCancel,
  onSubmit,
  isSubmitting,
}: EditMenuItemFormProps) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [basePrice, setBasePrice] = useState(item.base_price.toString());
  const [displayOrder, setDisplayOrder] = useState(
    item.display_order?.toString() ?? "",
  );
  const [isActive, setIsActive] = useState(item.is_active ?? true);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("base_price", basePrice);
    if (displayOrder.trim()) formData.append("display_order", displayOrder);
    formData.append("is_active", String(isActive));
    if (image) formData.append("image", image);
    onSubmit(formData);
  };

  return (
    <Card className="rounded-2xl border-[#EAE4DC] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-base font-medium text-[#292524]">
          Edit item
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-[#A8A29E] hover:text-[#57534E]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 grid gap-2.5">
        <Input
          placeholder="Item name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-9 rounded-lg"
        />
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="Base price"
          value={basePrice}
          onChange={(event) => setBasePrice(event.target.value)}
          className="h-9 rounded-lg"
        />
        <Input
          type="number"
          step="1"
          min="0"
          placeholder="Display order"
          value={displayOrder}
          onChange={(event) => setDisplayOrder(event.target.value)}
          className="h-9 rounded-lg"
        />
        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="h-9 rounded-lg"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          className="text-xs text-[#78716C]"
        />
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78716C]">Active</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="rounded-lg"
              disabled={!name.trim() || !basePrice.trim() || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
