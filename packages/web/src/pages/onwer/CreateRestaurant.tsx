import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiClient } from "@/lib/api-client";

import {
  RestaurantForm,
  type RestaurantFormData,
} from "@/components/shared/RestaurantForm";

export function CreateRestaurant() {
  const navigate = useNavigate();

  const [priceRanges] = useState<string[]>([
    "Budget",
    "Average",
    "Expensive",
    "Luxury",
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleCreate = async (
    data: RestaurantFormData,
  ) => {
    try {
      setIsSaving(true);
      setError(null);

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append(
        "description",
        data.description,
      );
      formData.append(
        "cuisine_type",
        data.cuisine_type,
      );
      formData.append(
        "price_range",
        data.price_range,
      );
      formData.append("email", data.email);
      formData.append("phone", data.phone);

      data.ambiance_tags.forEach((tag) => {
        formData.append(
          "ambiance_tags",
          tag,
        );
      });

      if (data.image) {
        formData.append(
          "image",
          data.image,
        );
      }

      await apiClient.post(
        "/owner/restaurants",
        formData,
      );

      navigate("/owner", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Failed to create restaurant:",
        error,
      );

      setError(
        "Unable to create your restaurant. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF8F5] px-6 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Small page heading */}
        <div className="mb-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
            Restaurant setup
          </p>

          <h1 className="mt-2 font-serif text-3xl font-medium tracking-[-0.04em] text-[#292524]">
            Create your restaurant
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#78716C]">
            Add the essential details to establish your restaurant
            on Platera.
          </p>
        </div>

        {/* Form */}
        <div
          className="
          rounded-[1.75rem]
          border border-[#E7E1D9]
          bg-white
          p-6
          shadow-[0_20px_60px_rgba(41,37,36,0.06)]
          sm:p-8
        "
        >
          <RestaurantForm
            mode="create"
            priceRanges={priceRanges}
            onSubmit={handleCreate}
            isSaving={isSaving}
            error={error}
          />
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center text-[11px] text-[#A8A29E]">
          You can add branches, menus, and additional details later.
        </p>
      </div>
    </div>
  );
}