import { useEffect, useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Menu, MenuUpdatePayload } from "@/types/menu";

interface MenuHeaderProps {
  menu: Menu;
  size: "lg" | "sm";
  onSave: (payload: MenuUpdatePayload) => void;
  onDelete?: () => void;
  isSaving: boolean;
  isDeleting?: boolean;
}

export function MenuHeader({
  menu,
  size,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: MenuHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(menu.name);
  const [description, setDescription] = useState(menu.description ?? "");
  const [isActive, setIsActive] = useState(menu.is_active ?? true);

  useEffect(() => {
    if(editing)
    setName(menu.name);
    setDescription(menu.description ?? "");
    setIsActive(menu.is_active ?? true);
  }, [editing, menu.name, menu.description, menu.is_active]);

  const save = () => {
    onSave({
      name: name.trim() || undefined,
      description: description.trim() || null,
      is_active: isActive,
    });
    setEditing(false);
  };

  const titleClass =
    size === "lg"
      ? "font-serif text-2xl font-medium text-[#292524]"
      : "font-serif text-lg font-medium text-[#292524]";

  if (editing) {
    return (
      <div className="w-full rounded-xl border border-[#EAE4DC] bg-[#FCFAF7] p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-9 rounded-lg"
            placeholder="Menu name"
            autoFocus
          />
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            className="h-9 rounded-lg"
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78716C]">Active</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <div className="flex gap-1.5">
            {onDelete && (
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-lg border-[#EAE4DC] text-red-600 hover:bg-red-50"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 rounded-lg border-[#EAE4DC]"
              onClick={() => setEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={save}
              disabled={isSaving}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={titleClass}>{menu.name}</h3>
          <Badge variant={isActive ? "secondary" : "outline"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        {menu.description && (
          <p className="mt-1 text-sm text-[#78716C]">{menu.description}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#78716C]">Available</span>
          <Switch
            checked={isActive}
            disabled={isSaving}
            onCheckedChange={(checked) => {
              setIsActive(checked);
              onSave({ is_active: checked });
            }}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-lg"
          onClick={() => setEditing(true)}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      </div>
    </div>
  );
}
