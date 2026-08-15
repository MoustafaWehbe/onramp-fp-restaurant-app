import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Building2,
    Clock,
    Edit3,
    MapPin,
    Phone,
    Star,
    Trash2,
} from "lucide-react";
import {
    useNavigate,
    useOutletContext,
    useParams,
} from "react-router-dom";

import { apiClient } from "@/lib/api-client";
import type { OwnerOutletContext } from "@/layouts/OwnerLayout";

import {
    OwnerBranchForm,
    type BranchForm,
} from "@/components/shared/OwnerBranchForm";
import Reviews from "@/components/shared/Reviews";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BranchImage {
    id: string;
    url: string;
    type: string;
}

interface ReviewUser {
    id: string;
    name: string;
}

interface BranchReview {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: ReviewUser;
}

interface Branch {
    id: string;
    restaurantId: string;
    name: string;
    slug: string;
    city: string;
    address: string;
    latitude: string;
    longitude: string;
    phone: string | null;
    opening_hours: string;
    review_count: number;
    average_rating: string | number;
    images: BranchImage[];
    reviews: BranchReview[];
}

interface Menu {
    id: string;
    name: string;
}

interface BranchDetailsResponse {
    branch: Branch;
    menus: Menu[];
    reviewSummary: {
        averageRating: string;
        totalReviews: number;
    };
}

export function OwnerBranchDetailsPage() {
    const navigate = useNavigate();

    const { restaurantSlug } =
        useOutletContext<OwnerOutletContext>();

    const { branchSlug } =
        useParams<{ branchSlug: string }>();

    const [data, setData] =
        useState<BranchDetailsResponse | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [isEditing, setIsEditing] =
        useState(false);

    const [isSaving, setIsSaving] =
        useState(false);

    const [isDeleting, setIsDeleting] =
        useState(false);

    const [saveError, setSaveError] =
        useState<string | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
        useState(false);

    const loadBranch = async () => {
        if (!restaurantSlug || !branchSlug) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await apiClient.get(
                `/owner/${encodeURIComponent(
                    restaurantSlug,
                )}/branches/${encodeURIComponent(
                    branchSlug,
                )}`,
            );

            setData(
                response.data.data ??
                    response.data,
            );
        } catch (error) {
            console.error(
                "Failed to load branch:",
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
                    "Unable to load the branch.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBranch();
    }, [restaurantSlug, branchSlug]);

    const handleUpdate = async (
        form: BranchForm,
    ) => {
        if (!restaurantSlug || !branchSlug) {
            return;
        }

        try {
            setIsSaving(true);
            setSaveError(null);

            const response = await apiClient.patch(
                `/owner/${encodeURIComponent(
                    restaurantSlug,
                )}/branches/${encodeURIComponent(
                    branchSlug,
                )}`,
                {
                    name: form.name,
                    city: form.city,
                    address: form.address,
                    latitude: form.latitude,
                    longitude: form.longitude,
                    phone: form.phone || null,
                    opening_hours:
                        form.opening_hours,
                    images: [],
                },
            );

            const updatedBranch =
                response.data.data ??
                response.data;

            setData((current) =>
                current
                    ? {
                          ...current,
                          branch: updatedBranch,
                      }
                    : current,
            );

            setIsEditing(false);

            /*
             * Reload because the branch slug may change
             * if the branch name was updated.
             */
            await loadBranch();
        } catch (error) {
            console.error(
                "Failed to update branch:",
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

            setSaveError(
                response?.data?.message ??
                    response?.data?.error ??
                    "Unable to update the branch. Please try again.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!restaurantSlug || !branchSlug) {
            return;
        }

        try {
            setIsDeleting(true);
            setError(null);

            await apiClient.delete(
                `/owner/${encodeURIComponent(
                    restaurantSlug,
                )}/branches/${encodeURIComponent(
                    branchSlug,
                )}`,
            );

            navigate("/owner/branches");
        } catch (error) {
            console.error(
                "Failed to delete branch:",
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
                    "Unable to delete the branch. Please try again.",
            );
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    const handleBack = () => {
        navigate("/owner/branches");
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FCFAF7]">
                        <Building2
                            className="h-5 w-5 text-[#A8A29E]"
                            strokeWidth={1.5}
                        />
                    </div>

                    <h2 className="mt-5 font-serif text-2xl font-medium text-[#292524]">
                        Branch not found
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#78716C]">
                        {error ??
                            "We couldn't find this branch."}
                    </p>

                    <Button
                        type="button"
                        onClick={handleBack}
                        className="mt-6 gap-2 rounded-xl"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to branches
                    </Button>
                </div>
            </div>
        );
    }

    /*
     * At this point the page cannot continue without these values.
     * This also tells TypeScript that restaurantSlug and branchSlug
     * are strings from here onward.
     */
    if (!restaurantSlug || !branchSlug) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Building2 className="mx-auto h-6 w-6 text-[#A8A29E]" />

                    <h2 className="mt-4 font-serif text-2xl text-[#292524]">
                        Branch not found
                    </h2>

                    <Button
                        type="button"
                        onClick={handleBack}
                        className="mt-6 gap-2 rounded-xl"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to branches
                    </Button>
                </div>
            </div>
        );
    }

    const { branch, menus, reviewSummary } = data;

    const initialValues: BranchForm = {
        name: branch.name,
        city: branch.city,
        address: branch.address,
        phone: branch.phone ?? "",
        opening_hours:
            branch.opening_hours ?? "",
        latitude: branch.latitude,
        longitude: branch.longitude,
    };

    /*
     * =========================================================
     * Edit mode
     * =========================================================
     */

    if (isEditing) {
        return (
            <div className="w-full">
                <header className="mb-10">
                    <button
                        type="button"
                        onClick={() =>
                            setIsEditing(false)
                        }
                        className="mb-5 flex items-center gap-2 text-sm text-[#78716C] transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to branch
                    </button>

                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A8A29E]">
                        Branch management
                    </p>

                    <h1 className="font-serif text-4xl font-medium tracking-[-0.04em] text-[#292524] md:text-5xl">
                        Edit Branch
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#78716C]">
                        Update the location, contact
                        information, and opening
                        hours for this branch.
                    </p>
                </header>

                <OwnerBranchForm
                    restaurantSlug={restaurantSlug}
                    mode="edit"
                    initialValues={initialValues}
                    onSubmit={handleUpdate}
                    onCancel={() =>
                        setIsEditing(false)
                    }
                    isSaving={isSaving}
                    error={saveError}
                />
            </div>
        );
    }

    /*
     * =========================================================
     * View mode
     * =========================================================
     */

    return (
        <div className="w-full">
            {/* Header */}

            <header className="mb-10">
                <button
                    type="button"
                    onClick={handleBack}
                    className="mb-5 flex items-center gap-2 text-sm text-[#78716C] transition-colors hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to branches
                </button>

                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A8A29E]">
                            Branch management
                        </p>

                        <h1 className="font-serif text-4xl font-medium tracking-[-0.04em] text-[#292524] md:text-5xl">
                            {branch.name}
                        </h1>

                        <p className="mt-3 text-sm text-[#78716C]">
                            Manage your branch
                            information and
                            location.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setIsEditing(true)
                            }
                            className="gap-2 rounded-xl border-[#EAE4DC]"
                        >
                            <Edit3 className="h-4 w-4" />
                            Edit Branch
                        </Button>

                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                                setIsDeleteDialogOpen(
                                    true,
                                )
                            }
                            disabled={isDeleting}
                            className="gap-2 rounded-xl"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>
            </header>

            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Main content */}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main branch information */}

                <div className="space-y-6 lg:col-span-2">
                    {/* Overview */}

                    <Card className="rounded-2xl border-[#EAE4DC] bg-white p-7 shadow-[0_8px_30px_rgba(41,37,36,0.04)]">
                        <div className="mb-6">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                                Branch details
                            </p>

                            <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.025em] text-[#292524]">
                                Location information
                            </h2>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            {/* Address */}

                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>

                                <div>
                                    <p className="text-xs text-[#A8A29E]">
                                        Address
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-[#292524]">
                                        {branch.address}
                                    </p>

                                    <p className="mt-0.5 text-sm text-[#78716C]">
                                        {branch.city}
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}

                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>

                                <div>
                                    <p className="text-xs text-[#A8A29E]">
                                        Phone
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-[#292524]">
                                        {branch.phone ??
                                            "No phone number"}
                                    </p>
                                </div>
                            </div>

                            {/* Opening hours */}

                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <Clock className="h-5 w-5 text-primary" />
                                </div>

                                <div>
                                    <p className="text-xs text-[#A8A29E]">
                                        Opening hours
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-[#292524]">
                                        {
                                            branch.opening_hours
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Rating */}

                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <Star className="h-5 w-5 text-primary" />
                                </div>

                                <div>
                                    <p className="text-xs text-[#A8A29E]">
                                        Rating
                                    </p>

                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="text-sm font-semibold text-[#292524]">
                                            {
                                                reviewSummary.averageRating
                                            }
                                        </span>

                                        <span className="text-sm text-[#78716C]">
                                            (
                                            {
                                                reviewSummary.totalReviews
                                            }{" "}
                                            reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Images */}

                    {branch.images.length > 0 && (
                        <Card className="rounded-2xl border-[#EAE4DC] bg-white p-7 shadow-[0_8px_30px_rgba(41,37,36,0.04)]">
                            <div className="mb-6">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                                    Gallery
                                </p>

                                <h2 className="mt-2 font-serif text-2xl font-semibold text-[#292524]">
                                    Branch images
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {branch.images.map(
                                    (image) => (
                                        <div
                                            key={
                                                image.id
                                            }
                                            className="aspect-[4/3] overflow-hidden rounded-xl bg-[#FCFAF7]"
                                        >
                                            <img
                                                src={
                                                    image.url
                                                }
                                                alt={
                                                    branch.name
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Reviews */}

                    <section>
                        <div className="mb-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                                Reviews
                            </p>

                            <h2 className="mt-2 font-serif text-2xl font-semibold text-[#292524]">
                                Customer Reviews
                            </h2>

                            <p className="mt-1 text-sm text-[#78716C]">
                                Reviews from customers
                                who visited this
                                branch.
                            </p>
                        </div>

                        <Reviews
                            reviews={branch.reviews}
                            onUpdate={() => {}}
                            onDelete={() => {}}
                        />
                    </section>
                </div>

                {/* Sidebar */}

                <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                    {/* Rating */}

                    <Card className="rounded-2xl border-[#EAE4DC] bg-white p-6 shadow-[0_8px_30px_rgba(41,37,36,0.04)]">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                            Branch rating
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                            <Star className="h-7 w-7 fill-primary text-primary" />

                            <span className="text-3xl font-semibold text-[#292524]">
                                {
                                    reviewSummary.averageRating
                                }
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-[#78716C]">
                            {
                                reviewSummary.totalReviews
                            }{" "}
                            total reviews
                        </p>
                    </Card>

                    {/* Menus */}

                    <Card className="rounded-2xl border-[#EAE4DC] bg-white p-6 shadow-[0_8px_30px_rgba(41,37,36,0.04)]">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                            Menus
                        </p>

                        <h3 className="mt-2 font-serif text-xl font-semibold text-[#292524]">
                            Active menus
                        </h3>

                        {menus.length === 0 ? (
                            <p className="mt-4 text-sm text-[#78716C]">
                                No active menus
                                available.
                            </p>
                        ) : (
                            <div className="mt-4 space-y-2">
                                {menus.map(
                                    (menu) => (
                                        <div
                                            key={
                                                menu.id
                                            }
                                            className="rounded-xl bg-[#FCFAF7] px-4 py-3 text-sm font-medium text-[#292524]"
                                        >
                                            {
                                                menu.name
                                            }
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Coordinates */}

                    <Card className="rounded-2xl border-[#EAE4DC] bg-white p-6 shadow-[0_8px_30px_rgba(41,37,36,0.04)]">
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-primary" />

                            <div>
                                <p className="text-xs text-[#A8A29E]">
                                    Coordinates
                                </p>

                                <p className="mt-1 text-xs text-[#78716C]">
                                    {branch.latitude},{" "}
                                    {branch.longitude}
                                </p>
                            </div>
                        </div>
                    </Card>
                </aside>
            </div>

            {/* Delete confirmation */}

            <ConfirmDialog
                open={isDeleteDialogOpen}
                title="Delete branch?"
                description={`Are you sure you want to delete "${branch.name}"? This action cannot be undone.`}
                confirmText={
                    isDeleting
                        ? "Deleting..."
                        : "Delete Branch"
                }
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() =>
                    setIsDeleteDialogOpen(false)
                }
            />
        </div>
    );
}