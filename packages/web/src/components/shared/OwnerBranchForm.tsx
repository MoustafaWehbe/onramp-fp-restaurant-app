import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationPicker } from "@/components/shared/LocationPicker";

export interface BranchForm {
    name: string;
    city: string;
    address: string;
    phone: string;
    opening_hours: string;
    latitude: string;
    longitude: string;
}

export const EMPTY_BRANCH_FORM: BranchForm = {
    name: "",
    city: "",
    address: "",
    phone: "",
    opening_hours: "",
    latitude: "",
    longitude: "",
};

interface OwnerBranchFormProps {
    restaurantSlug: string;
    mode: "create" | "edit";
    initialValues?: BranchForm;
    onSubmit: (data: BranchForm) => Promise<void>;
    onCancel: () => void;
    isSaving?: boolean;
    error?: string | null;
}

export function OwnerBranchForm({
    restaurantSlug,
    mode,
    initialValues,
    onSubmit,
    onCancel,
    isSaving = false,
    error = null,
}: OwnerBranchFormProps) {
    const [form, setForm] = useState<BranchForm>(
        initialValues ?? EMPTY_BRANCH_FORM,
    );

    const [isLocationProcessing, setIsLocationProcessing] =
        useState(false);

    useEffect(() => {
        if (initialValues) {
            setForm(initialValues);
        }
    }, [initialValues]);

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

        if (isLocationProcessing) {
            return;
        }

        if (!form.latitude || !form.longitude) {
            return;
        }

        await onSubmit(form);
    };

    const isEditMode = mode === "edit";

    return (
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
                        {isEditMode
                            ? "Update the information for this branch."
                            : "Provide the basic information for this branch."}
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
                                    event.target.value,
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
                                    event.target.value,
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
                                    event.target.value,
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
                                    event.target.value,
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
                            value={form.opening_hours}
                            onChange={(event) =>
                                handleChange(
                                    "opening_hours",
                                    event.target.value,
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
                        restaurantSlug={restaurantSlug}
                        value={{
                            latitude: form.latitude,
                            longitude: form.longitude,
                        }}
                        onChange={(location) =>
                            setForm((previous) => ({
                                ...previous,
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }))
                        }
                        onProcessingChange={
                            setIsLocationProcessing
                        }
                    />
                </div>

                {/* Images */}

                <div className="border-t border-[#EEE9E2] pt-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                        Branch images
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#78716C]">
                        Images can be added when the branch
                        image upload flow is available.
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
                        onClick={onCancel}
                        disabled={isSaving}
                        className="rounded-xl border-[#EAE4DC]"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={
                            isSaving ||
                            isLocationProcessing
                        }
                        className="gap-2 rounded-xl"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {isEditMode
                                    ? "Saving..."
                                    : "Creating..."}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                {isEditMode
                                    ? "Save Changes"
                                    : "Create Branch"}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    );
}