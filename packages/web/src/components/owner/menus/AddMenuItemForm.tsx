import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AddMenuItemFormProps {
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}

export function AddMenuItemForm({
  onCancel,
  onSubmit,
  isSubmitting,
}: AddMenuItemFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name.trim());
    if (description.trim()) formData.append("description", description.trim());
    formData.append("base_price", basePrice);
    if (displayOrder.trim()) formData.append("display_order", displayOrder);
    if (image) formData.append("image", image);
    onSubmit(formData);
  };

  return (
    <Card className="mb-5 rounded-2xl border-[#EAE4DC] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-medium text-[#292524]">
          New item
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-[#A8A29E] hover:text-[#57534E]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="Item name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-lg"
        />
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="Base price"
          value={basePrice}
          onChange={(event) => setBasePrice(event.target.value)}
          className="rounded-lg"
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="rounded-lg sm:col-span-2"
        />
        <Input
          type="number"
          step="1"
          min="0"
          placeholder="Display order (optional)"
          value={displayOrder}
          onChange={(event) => setDisplayOrder(event.target.value)}
          className="rounded-lg"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          className="text-sm text-[#78716C] sm:col-span-2"
        />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" className="rounded-lg" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="rounded-lg"
          disabled={!name.trim() || !basePrice.trim() || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Adding..." : "Add item"}
        </Button>
      </div>
    </Card>
  );
}
