import { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  Loader2,
  Save,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";

export interface RestaurantFormData {
  name: string;
  image: File | null;
  description: string;
  cuisine_type: string;
  ambiance_tags: string[];
  price_range: string;
  email: string;
  phone: string;
}

export const EMPTY_RESTAURANT_FORM: RestaurantFormData = {
  name: "",
  image: null,
  description: "",
  cuisine_type: "",
  ambiance_tags: [],
  price_range: "",
  email: "",
  phone: "",
};

const AMBIANCE_SUGGESTIONS = [
  "Casual",
  "Elegant",
  "Cozy",
  "Romantic",
  "Family-friendly",
  "Modern",
  "Traditional",
  "Outdoor",
  "Quiet",
  "Lively",
];

const CUISINE_OPTIONS = [
  "Lebanese",
  "Italian",
  "French",
  "Japanese",
  "Chinese",
  "Mediterranean",
  "American",
  "Mexican",
  "Indian",
  "Thai",
  "International",
];

interface RestaurantFormProps {
  mode: "create" | "edit";

  initialValues?: Partial<RestaurantFormData>;

  priceRanges: string[];

  onSubmit: (data: RestaurantFormData) => Promise<void>;

  onCancel?: () => void;

  isSaving?: boolean;

  error?: string | null;
}

export function RestaurantForm({
  mode,
  initialValues,
  priceRanges,
  onSubmit,
  onCancel,
  isSaving = false,
  error = null,
}: RestaurantFormProps) {
  const [form, setForm] = useState<RestaurantFormData>({
    ...EMPTY_RESTAURANT_FORM,
    ...initialValues,
  });

  useEffect(() => {
    if (!initialValues) return;

    setForm({
      ...EMPTY_RESTAURANT_FORM,
      ...initialValues,
      image: null,
    });
  }, [initialValues]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await onSubmit(form);
  };

  const updateField = <
    K extends keyof RestaurantFormData
  >(
    field: K,
    value: RestaurantFormData[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const isCreateMode = mode === "create";

  return (
    <Card className="rounded-2xl border-[#EAE4DC] bg-white p-7 shadow-[0_8px_30px_rgba(41,37,36,0.04)]">
      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Header */}

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
            Restaurant details
          </p>

          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.025em] text-[#292524]">
            {isCreateMode
              ? "Create your restaurant"
              : "Edit your profile"}
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#78716C]">
            {isCreateMode
              ? "Complete your restaurant information before adding branches."
              : "Changes here apply to all branches of your restaurant."}
          </p>
        </div>

        {/* Fields */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Name */}

          <div className="space-y-2">
            <Label htmlFor="restaurant-name">
              Restaurant name
            </Label>

            <Input
              id="restaurant-name"
              value={form.name}
              onChange={(event) =>
                updateField(
                  "name",
                  event.target.value,
                )
              }
              placeholder="Restaurant name"
              required
            />
          </div>

          {/* Cuisine */}

          <div className="space-y-2">
            <Label>Cuisine type</Label>

            <Select
              value={form.cuisine_type}
              onValueChange={(value) =>
                updateField(
                  "cuisine_type",
                  value,
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>

              <SelectContent>
                {CUISINE_OPTIONS.map(
                  (cuisine) => (
                    <SelectItem
                      key={cuisine}
                      value={cuisine}
                    >
                      {cuisine}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}

          <div className="space-y-2">
            <Label>Price range</Label>

            <Select
              value={form.price_range}
              onValueChange={(value) =>
                updateField(
                  "price_range",
                  value,
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>

              <SelectContent>
                {priceRanges.map(
                  (price) => (
                    <SelectItem
                      key={price}
                      value={price}
                    >
                      {price}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Image */}

          <div className="space-y-2">
            <Label htmlFor="restaurant-image">
              Cover image
            </Label>

            <Input
              id="restaurant-image"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file =
                  event.target.files?.[0] ??
                  null;

                updateField(
                  "image",
                  file,
                );
              }}
              disabled={isSaving}
            />
          </div>

          {/* Email */}

          <div className="space-y-2">
            <Label htmlFor="restaurant-email">
              Contact email
            </Label>

            <Input
              id="restaurant-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField(
                  "email",
                  event.target.value,
                )
              }
              placeholder="hello@restaurant.com"
            />
          </div>

          {/* Phone */}

          <div className="space-y-2">
            <Label htmlFor="restaurant-phone">
              Contact phone
            </Label>

            <Input
              id="restaurant-phone"
              value={form.phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value,
                )
              }
              placeholder="+961 ..."
            />
          </div>

          {/* Description */}

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="restaurant-description">
              Description
            </Label>

            <textarea
              id="restaurant-description"
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value,
                )
              }
              rows={5}
              placeholder="Tell guests about your restaurant..."
              className="flex w-full resize-none rounded-xl border border-[#EAE4DC] bg-white px-3 py-2.5 text-sm text-[#292524] outline-none transition-colors placeholder:text-[#A8A29E] focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Ambiance */}

          <div className="space-y-2 md:col-span-2">
            <Label>Ambiance tags</Label>

            <TagInput
              value={form.ambiance_tags}
              onChange={(value) =>
                updateField(
                  "ambiance_tags",
                  value,
                )
              }
              suggestions={
                AMBIANCE_SUGGESTIONS
              }
              placeholder="Add an ambiance tag..."
            />
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Actions */}

        <div className="flex justify-end gap-3 border-t border-[#EEE9E2] pt-6">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="gap-2 rounded-xl border-[#EAE4DC]"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            disabled={
              isSaving ||
              !form.name ||
              !form.cuisine_type ||
              !form.price_range
            }
            className="gap-2 rounded-xl"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isCreateMode
                  ? "Creating..."
                  : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />

                {isCreateMode
                  ? "Create Restaurant"
                  : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}