import { useEffect, useState } from "react";
import { Check, ImageOff, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type {
  BranchMenuItem,
  BranchMenuItemOverridePayload,
} from "@/types/menu";

interface BranchMenuItemRowProps {
  item: BranchMenuItem;
  onSave: (payload: BranchMenuItemOverridePayload) => void;
}

export function BranchMenuItemRow({ item, onSave }: BranchMenuItemRowProps) {
  const [editingPrice, setEditingPrice] = useState(false);
  const displayedPrice = item.price ?? item.customPrice ?? item.base_price;
  const [priceInput, setPriceInput] = useState(String(displayedPrice));
  const isOverridden =
    item.isOverridden ??
    (item.customPrice !== undefined && item.customPrice !== null);
  const isAvailable = item.isAvailable ?? true;

  useEffect(() => {
    setPriceInput(String(item.price ?? item.customPrice ?? item.base_price));
  }, [item.base_price, item.customPrice, item.price]);

  const savePrice = () => {
    const trimmed = priceInput.trim();
    const price = Number(trimmed);

    if (trimmed === "" || !Number.isFinite(price) || price < 0) {
      setPriceInput(String(displayedPrice));
      setEditingPrice(false);
      return;
    }

    if (price !== Number(displayedPrice)) {
      onSave({ customPrice: price });
    }

    setEditingPrice(false);
  };

  const handleAvailabilityChange = (checked: boolean) => {
    if (checked !== isAvailable) {
      onSave({ isAvailable: checked });
    }
  };

  return (
    <Card className="flex items-center gap-4 rounded-2xl border-[#EAE4DC] bg-white p-4">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#FCFAF7]">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-4 w-4 text-[#D6D3D1]" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-[#292524]">{item.name}</p>
          {isOverridden && (
            <Badge variant="secondary" className="shrink-0">
              Overridden
            </Badge>
          )}
        </div>
        <p className="text-xs text-[#A8A29E]">
          Base price: ${Number(item.base_price).toFixed(2)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {editingPrice ? (
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={priceInput}
              onChange={(event) => setPriceInput(event.target.value)}
              className="h-9 w-24 rounded-lg"
              autoFocus
            />
            <Button
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={savePrice}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingPrice(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-[#292524] hover:text-[#57534E]"
          >
            ${Number(displayedPrice).toFixed(2)}
            <Pencil className="h-3.5 w-3.5 text-[#A8A29E]" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#78716C]">Available</span>
          <Switch
            checked={isAvailable}
            onCheckedChange={handleAvailabilityChange}
            aria-label={`Set ${item.name} availability`}
          />
        </div>
      </div>
    </Card>
  );
}
