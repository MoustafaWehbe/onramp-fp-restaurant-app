import { useState } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import {
    useNavigate,
    useOutletContext,
} from "react-router-dom";

import { apiClient } from "@/lib/api-client";
import type { OwnerOutletContext } from "@/layouts/OwnerLayout";

import {
    OwnerBranchForm,
    type BranchForm,
} from "@/components/shared/OwnerBranchForm";

export function OwnerBranchCreationPage() {
    const navigate = useNavigate();

    const { restaurantSlug } =
        useOutletContext<OwnerOutletContext>();

    const [isSaving, setIsSaving] = useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const handleSubmit = async (form: BranchForm) => {
        if (!restaurantSlug) {
            setError("Restaurant not found.");
            return;
        }

        try {
            setIsSaving(true);
            setError(null);

            await apiClient.post(
                `/owner/${encodeURIComponent(
                    restaurantSlug,
                )}/branches`,
                {
                    name: form.name,
                    city: form.city,
                    address: form.address,
                    latitude: form.latitude,
                    longitude: form.longitude,
                    phone: form.phone || null,
                    opening_hours: form.opening_hours,
                    images: [],
                },
            );

            navigate("/owner/branches");
        } catch (error) {
            console.error(
                "Failed to create branch:",
                error,
            );

            const response = (
                error as {
                    response?: {
                        data?: {
                            message?: string;
                            error?: string;
                        };
                    };
                }
            ).response;

            setError(
                response?.data?.message ??
                    response?.data?.error ??
                    "Unable to create the branch. Please try again.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (!restaurantSlug) {
            return;
        }

        navigate("/owner/branches");
    };

    if (!restaurantSlug) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Building2 className="mx-auto h-6 w-6 text-[#A8A29E]" />

                    <h2 className="mt-4 font-serif text-2xl text-[#292524]">
                        No restaurant found
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header */}

            <header className="mb-10">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="mb-5 flex items-center gap-2 text-sm text-[#78716C] transition-colors hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to branches
                </button>

                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A8A29E]">
                    Branch management
                </p>

                <h1 className="font-serif text-4xl font-medium tracking-[-0.04em] text-[#292524] md:text-5xl">
                    Add Branch
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#78716C]">
                    Add a new location for your
                    restaurant. Guests will be able to
                    find this branch using the
                    information you provide.
                </p>
            </header>


            <OwnerBranchForm
                restaurantSlug={restaurantSlug}
                mode="create"
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSaving={isSaving}
                error={error}
            />
        </div>
    );
}