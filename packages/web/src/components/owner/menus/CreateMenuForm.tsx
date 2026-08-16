import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { MenuPayload } from "@/types/menu";

interface CreateMenuFormProps {
  onCancel: () => void;
  onSubmit: (payload: MenuPayload) => void;
  isSubmitting: boolean;
}

export function CreateMenuForm({
  onCancel,
  onSubmit,
  isSubmitting,
}: CreateMenuFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
          placeholder="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="rounded-lg"
        />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" className="rounded-lg" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="rounded-lg"
          disabled={!name.trim() || isSubmitting}
          onClick={() =>
            onSubmit({
              name: name.trim(),
              description: description.trim() || undefined,
            })
          }
        >
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
    </Card>
  );
}
