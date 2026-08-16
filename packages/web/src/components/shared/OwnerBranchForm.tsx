import { useEffect, useState } from "react";
import {
    ImagePlus,
    Loader2,
    Save,
    Trash2,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationPicker } from "@/components/shared/LocationPicker";

export interface BranchImage {
    id: string;
    url: string;
    type: string;
}

export interface BranchForm {
    name: string;
    city: string;
    address: string;
    phone: string;
    opening_hours: string;
    latitude: string;
    longitude: string;
    images: File[];
    deletedImageIds: string[];
}

export const EMPTY_BRANCH_FORM: BranchForm = {
    name: "",
    city: "",
    address: "",
    phone: "",
    opening_hours: "",
    latitude: "",
    longitude: "",
    images: [],
    deletedImageIds: [],
};

const EMPTY_IMAGES: BranchImage[] = [];

interface OwnerBranchFormProps {
    restaurantSlug: string;
    mode: "create" | "edit";
    initialValues?: Omit<
        BranchForm,
        "images" | "deletedImageIds"
    >;
    existingImages?: BranchImage[];
    onSubmit: (data: BranchForm) => Promise<void>;
    onCancel: () => void;
    isSaving?: boolean;
    error?: string | null;
}

export function OwnerBranchForm({
    restaurantSlug,
    mode,
    initialValues,
    existingImages = EMPTY_IMAGES,
    onSubmit,
    onCancel,
    isSaving = false,
    error = null,
}: OwnerBranchFormProps) {
    const [form, setForm] = useState<BranchForm>({
        ...EMPTY_BRANCH_FORM,
        ...initialValues,
    });

    const [isLocationProcessing, setIsLocationProcessing] =
        useState(false);

    const [locationError, setLocationError] =
        useState<string | null>(null);

    const [previewUrls, setPreviewUrls] =
        useState<string[]>([]);

    const [remainingImages, setRemainingImages] =
        useState<BranchImage[]>(existingImages);

    /*
     * Sync the form when editing data changes.
     */
    useEffect(() => {
        if (!initialValues) return;

        setForm({
            ...EMPTY_BRANCH_FORM,
            ...initialValues,
            images: [],
            deletedImageIds: [],
        });

        setRemainingImages(existingImages);
    }, [initialValues, existingImages]);
    /*
     * Create previews for newly selected images.
     */
    useEffect(() => {
        const urls = form.images.map((file) =>
            URL.createObjectURL(file),
        );

        setPreviewUrls(urls);

        return () => {
            urls.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, [form.images]);

    const handleChange = (
        field: keyof Omit<
            BranchForm,
            "images" | "deletedImageIds"
        >,
        value: string,
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(
            event.target.files ?? [],
        );

        if (!files.length) {
            return;
        }

        setForm((current) => ({
            ...current,
            images: [
                ...current.images,
                ...files,
            ],
        }));

        /*
         * Allows selecting the same file again later.
         */
        event.target.value = "";
    };

    const removeNewImage = (index: number) => {
        setForm((current) => ({
            ...current,
            images: current.images.filter(
                (_, imageIndex) =>
                    imageIndex !== index,
            ),
        }));
    };

    const removeExistingImage = (
        image: BranchImage,
    ) => {
        setRemainingImages((current) =>
            current.filter(
                (existing) =>
                    existing.id !== image.id,
            ),
        );

        setForm((current) => {
            /*
             * Prevent the same image ID from being
             * added to deletedImageIds twice.
             */
            if (
                current.deletedImageIds.includes(
                    image.id,
                )
            ) {
                return current;
            }

            return {
                ...current,
                deletedImageIds: [
                    ...current.deletedImageIds,
                    image.id,
                ],
            };
        });
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (isLocationProcessing) {
            return;
        }

        if (
            !form.latitude ||
            !form.longitude
        ) {
            setLocationError(
                "Please add a branch location before saving.",
            );
            return;
        }

        setLocationError(null);

        await onSubmit(form);
    };

    const isEditMode = mode === "edit";

    return (
        <Card className="rounded-2xl border-[#EAE4DC] bg-white p-7 shadow-[0_8px_30px_rgba(41,37,36,0.04)]">
            <form
                onSubmit={handleSubmit}
                className="space-y-8"
            >
                {/* Branch details */}

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
                            latitude:
                                form.latitude,
                            longitude:
                                form.longitude,
                        }}
                        onChange={(location) =>
                            setForm((previous) => ({
                                ...previous,
                                latitude:
                                    location.latitude,
                                longitude:
                                    location.longitude,
                            }))
                        }
                        onProcessingChange={
                            setIsLocationProcessing
                        }
                    />

                    {locationError && (
                        <p className="mt-3 text-sm text-red-600">
                            {locationError}
                        </p>
                    )}
                </div>

                {/* Images */}

                <div className="border-t border-[#EEE9E2] pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                                Branch images
                            </p>

                            <p className="mt-2 text-sm leading-6 text-[#78716C]">
                                Upload one or more
                                images for this
                                branch.
                            </p>
                        </div>

                        <label
                            htmlFor="branch-images"
                            className={`inline-flex items-center rounded-xl transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${isSaving
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer"
                                }`}
                        >
                            <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
                                <ImagePlus className="h-4 w-4" />
                                Add images
                            </span>

                            <input
                                id="branch-images"
                                type="file"
                                accept="image/*"
                                multiple
                                className="sr-only"
                                onChange={handleImageChange}
                                disabled={isSaving}
                            />
                        </label>
                    </div>

                    {/* Existing images */}

                    {remainingImages.length >
                        0 && (
                            <div className="mt-5">
                                <p className="mb-3 text-xs font-medium text-[#78716C]">
                                    Current images
                                </p>

                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    {remainingImages.map(
                                        (image) => (
                                            <div
                                                key={
                                                    image.id
                                                }
                                                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#FCFAF7]"
                                            >
                                                <img
                                                    src={
                                                        image.url
                                                    }
                                                    alt="Branch"
                                                    className="h-full w-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExistingImage(
                                                            image,
                                                        )
                                                    }
                                                    disabled={
                                                        isSaving
                                                    }
                                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-red-600"
                                                    aria-label="Remove image"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                    {/* New images */}

                    {previewUrls.length >
                        0 && (
                            <div className="mt-5">
                                <p className="mb-3 text-xs font-medium text-[#78716C]">
                                    New images
                                </p>

                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    {previewUrls.map(
                                        (
                                            url,
                                            index,
                                        ) => (
                                            <div
                                                key={
                                                    url
                                                }
                                                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#FCFAF7]"
                                            >
                                                <img
                                                    src={
                                                        url
                                                    }
                                                    alt={`New branch image ${index +
                                                        1
                                                        }`}
                                                    className="h-full w-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewImage(
                                                            index,
                                                        )
                                                    }
                                                    disabled={
                                                        isSaving
                                                    }
                                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-red-600"
                                                    aria-label="Remove selected image"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
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
                            isLocationProcessing ||
                            !form.latitude ||
                            !form.longitude
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