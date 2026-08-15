import { useState } from "react";
import {
    ArrowLeft,
    Building2,
    Loader2,
    Save,
} from "lucide-react";
import {
    useNavigate,
    useOutletContext,
} from "react-router-dom";

import { apiClient } from "@/lib/api-client";
import type { OwnerOutletContext } from "@/layouts/OwnerLayout";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationPicker } from "@/components/shared/LocationPicker";

interface BranchForm {
    name: string;
    city: string;
    address: string;
    phone: string;
    opening_hours: string;
    latitude: string;
    longitude: string;
}

const EMPTY_FORM: BranchForm = {
    name: "",
    city: "",
    address: "",
    phone: "",
    opening_hours: "",
    latitude: "",
    longitude: "",
};

export function OwnerBranchCreationPage() {
    const navigate = useNavigate();

    const { restaurantSlug } =
        useOutletContext<OwnerOutletContext>();

    const [form, setForm] =
        useState<BranchForm>(EMPTY_FORM);

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const handleChange = (
        field: keyof BranchForm,
        value: string,
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!restaurantSlug) {
            setError("Restaurant not found.");
            return;
        }

        if (!form.latitude || !form.longitude) {
            setError(
                "Please add the branch location using Google Maps.",
            );
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

            // Branch created successfully
            navigate(
                `/owner/branches`,
            );
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

        navigate(
            `/owner/branches`,
        );
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

            {/* Form */}

            <Card className="rounded-2xl border-[#EAE4DC] bg-white p-7 shadow-[0_8px_30px_rgba(41,37,36,0.04)]">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >
                    {/* Section heading */}

                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                            Branch details
                        </p>

                        <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.025em] text-[#292524]">
                            Location information
                        </h2>

                        <p className="mt-1 text-sm text-[#78716C]">
                            Provide the basic information
                            for this branch.
                        </p>
                    </div>

                    {/* Fields */}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Name */}

                        <div className="space-y-2">
                            <Label htmlFor="branch-name">
                                Branch name
                            </Label>

                            <Input
                                id="branch-name"
                                value={form.name}
                                onChange={(event) =>
                                    handleChange(
                                        "name",
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="Downtown Branch"
                                required
                            />
                        </div>

                        {/* City */}

                        <div className="space-y-2">
                            <Label htmlFor="branch-city">
                                City
                            </Label>

                            <Input
                                id="branch-city"
                                value={form.city}
                                onChange={(event) =>
                                    handleChange(
                                        "city",
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="Beirut"
                                required
                            />
                        </div>

                        {/* Address */}

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="branch-address">
                                Address
                            </Label>

                            <Input
                                id="branch-address"
                                value={form.address}
                                onChange={(event) =>
                                    handleChange(
                                        "address",
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="Hamra Street, Beirut"
                                required
                            />
                        </div>

                        {/* Phone */}

                        <div className="space-y-2">
                            <Label htmlFor="branch-phone">
                                Phone
                            </Label>

                            <Input
                                id="branch-phone"
                                type="tel"
                                value={form.phone}
                                onChange={(event) =>
                                    handleChange(
                                        "phone",
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="+961 ..."
                            />
                        </div>

                        {/* Opening hours */}

                        <div className="space-y-2">
                            <Label htmlFor="branch-opening-hours">
                                Opening hours
                            </Label>

                            <Input
                                id="branch-opening-hours"
                                value={
                                    form.opening_hours
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "opening_hours",
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="09:00 - 23:00"
                                required
                            />
                        </div>
                    </div>

                    {/* Location */}

                    <div className="border-t border-[#EEE9E2] pt-6">
                        <LocationPicker
                            restaurantSlug={
                                restaurantSlug
                            }
                            value={{
                                latitude:
                                    form.latitude,
                                longitude:
                                    form.longitude,
                            }}
                            onChange={(location) =>
                                setForm((prev) => ({
                                    ...prev,
                                    latitude:
                                        location.latitude,
                                    longitude:
                                        location.longitude,
                                }))
                            }
                        />
                    </div>

                    {/* Images */}

                    <div className="border-t border-[#EEE9E2] pt-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                            Branch images
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[#78716C]">
                            Images can be added when the
                            branch image upload flow is
                            available.
                        </p>
                    </div>

                    {/* Error */}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Actions */}

                    <div className="flex flex-col-reverse gap-3 border-t border-[#EEE9E2] pt-6 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="rounded-xl border-[#EAE4DC]"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="gap-2 rounded-xl"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Create Branch
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}