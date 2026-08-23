import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface DraftMenuItem {
  id: number;
  name: string;
  description: string;
  basePrice: string;
  displayOrder: string;
  isActive: boolean;
  image: File | null;
}

interface CreateMenuFormProps {
  onCancel: () => void;
  onSubmit: (payload: FormData) => void;
  isSubmitting: boolean;
}

const newDraftMenuItem = (id: number): DraftMenuItem => ({
  id,
  name: "",
  description: "",
  basePrice: "",
  displayOrder: "",
  isActive: true,
  image: null,
});

export function CreateMenuForm({
  onCancel,
  onSubmit,
  isSubmitting,
}: CreateMenuFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [items, setItems] = useState<DraftMenuItem[]>([]);
  const [nextItemId, setNextItemId] = useState(1);

  const updateItem = (
    id: number,
    changes: Partial<Omit<DraftMenuItem, "id">>,
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, ...changes } : item,
      ),
    );
  };

  const addItem = () => {
    setItems((currentItems) => [...currentItems, newDraftMenuItem(nextItemId)]);
    setNextItemId((currentId) => currentId + 1);
  };

  const removeItem = (id: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const hasInvalidItem = items.some(
    (item) => !item.name.trim() || !item.basePrice.trim(),
  );

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name.trim());

    const trimmedDescription = description.trim();
    if(trimmedDescription) {
      formData.append("description", description.trim());
    }
    formData.append("is_active", String(isActive));

    let imageIndex = 0;
    const itemPayloads = items.map((item) => {
      const payload: {
        name: string;
        description: string | null;
        base_price: string;
        display_order?: string;
        is_active: boolean;
        imageIndex?: number;
      } = {
        name: item.name.trim(),
        description: item.description.trim() || null,
        base_price: item.basePrice,
        is_active: item.isActive,
      };

      if (item.displayOrder.trim()) {
        payload.display_order = item.displayOrder;
      }

      if (item.image) {
        payload.imageIndex = imageIndex;
        formData.append("image", item.image);
        imageIndex += 1;
      }

      return payload;
    });

    if (itemPayloads.length) {
      formData.append("items", JSON.stringify(itemPayloads));
    }

    onSubmit(formData);
  };

  return (
    <Card className="mt-4 rounded-2xl border-[#EAE4DC] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-medium text-[#292524]">
          New menu
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-[#A8A29E] hover:text-[#57534E]"
          aria-label="Close new menu form"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        <Input
          placeholder="Menu name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-lg"
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="rounded-lg"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#57534E]">Menu available</span>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>

      <div className="mt-6 border-t border-[#EAE4DC] pt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="font-medium text-[#292524]">Initial menu items</h4>
            <p className="mt-1 text-sm text-[#78716C]">
              Add items now, or create the menu and add them later.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-lg"
            onClick={addItem}
          >
            <Plus className="h-4 w-4" />
            Add item
          </Button>
        </div>

        {items.length > 0 && (
          <div className="mt-4 space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#292524]">
                    Item {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-[#A8A29E] hover:text-red-600"
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Item name"
                    value={item.name}
                    onChange={(event) =>
                      updateItem(item.id, { name: event.target.value })
                    }
                    className="rounded-lg"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Base price"
                    value={item.basePrice}
                    onChange={(event) =>
                      updateItem(item.id, { basePrice: event.target.value })
                    }
                    className="rounded-lg"
                  />
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(event) =>
                      updateItem(item.id, { description: event.target.value })
                    }
                    className="rounded-lg sm:col-span-2"
                  />
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="Display order (optional)"
                    value={item.displayOrder}
                    onChange={(event) =>
                      updateItem(item.id, {
                        displayOrder: event.target.value,
                      })
                    }
                    className="rounded-lg"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      updateItem(item.id, {
                        image: event.target.files?.[0] ?? null,
                      })
                    }
                    className="text-sm text-[#78716C]"
                  />
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <span className="text-sm text-[#57534E]">Available</span>
                    <Switch
                      checked={item.isActive}
                      onCheckedChange={(checked) =>
                        updateItem(item.id, { isActive: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" className="rounded-lg" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="rounded-lg"
          disabled={!name.trim() || hasInvalidItem || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Creating..." : "Create menu"}
        </Button>
      </div>
    </Card>
  );
}
