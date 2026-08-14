import { useEffect, useState } from "react";
import {
    Image as ImageIcon,
    Loader2,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Save,
    Star,
    Store,
    X,
} from "lucide-react";
import {
    useNavigate,
    useOutletContext,
} from "react-router-dom";

import { apiClient } from "@/lib/api-client";
import type { OwnerOutletContext } from "@/layouts/OwnerLayout";

import { Badge } from "@/components/ui/badge";
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

interface Restaurant {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    description: string | null;
    cuisine_type: string | null;
    ambiance_tags: string[];
    price_range: string | null;
    email: string | null;
    phone: string | null;
    review_count: number;
    average_rating: number | string;

    location?: string | null;
    branch_count?: number;
    is_published?: boolean;
}

interface RestaurantForm {
    name: string;
    image_url: string;
    description: string;
    cuisine_type: string;
    ambiance_tags: string[];
    price_range: string;
    email: string;
    phone: string;
}

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

const EMPTY_FORM: RestaurantForm = {
    name: "",
    image_url: "",
    description: "",
    cuisine_type: "",
    ambiance_tags: [],
    price_range: "",
    email: "",
    phone: "",
};

export function RestaurantOwnerPage() {
    const navigate = useNavigate();

    const { restaurantSlug } =
        useOutletContext<OwnerOutletContext>();

    const [restaurant, setRestaurant] =
        useState<Restaurant | null>(null);

    const [form, setForm] =
        useState<RestaurantForm>(EMPTY_FORM);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isEditing, setIsEditing] =
        useState(false);

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [saveError, setSaveError] =
        useState<string | null>(null);

    const [priceRanges, setPriceRanges] = useState<string[]>([]);
    /* ========================================================= */
    /* Load Restaurant                                             */
    /* ========================================================= */

    useEffect(() => {
        if (!restaurantSlug) {
            setIsLoading(false);
            return;
        }

        const loadRestaurant = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await apiClient.get(
                    `/owner/restaurants/${restaurantSlug}`,
                );

                setRestaurant(
                    response.data.data ??
                    response.data,
                );
            } catch (error) {
                console.error(
                    "Failed to load restaurant:",
                    error,
                );

                setError(
                    "Unable to load your restaurant profile.",
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadRestaurant();
    }, [restaurantSlug]);

    useEffect(() => {
        const fetchPriceRanges = async () => {
            try {
                const response = await apiClient.get("/restaurants");

                const restaurants = response.data.data;

                const ranges: string[] = Array.from(
                    new Set(
                        restaurants
                            .map(
                                (restaurant: { price_range: string }) =>
                                    restaurant.price_range,
                            )
                            .filter(Boolean),
                    ),
                );

                setPriceRanges(ranges);
            } catch (error) {
                console.error(
                    "Failed to fetch price ranges:",
                    error,
                );
            }
        };

        fetchPriceRanges();
    }, []);
    /* ========================================================= */
    /* Edit                                                        */
    /* ========================================================= */

    const handleEdit = () => {
        if (!restaurant) {
            return;
        }

        setForm({
            name: restaurant.name ?? "",
            image_url:
                restaurant.image_url ?? "",
            description:
                restaurant.description ?? "",
            cuisine_type:
                restaurant.cuisine_type ?? "",
            ambiance_tags:
                restaurant.ambiance_tags ?? [],
            price_range:
                restaurant.price_range ?? "",
            email: restaurant.email ?? "",
            phone: restaurant.phone ?? "",
        });

        setSaveError(null);
        setIsEditing(true);
    };

    /* ========================================================= */
    /* Cancel                                                      */
    /* ========================================================= */

    const handleCancel = () => {
        setIsEditing(false);
        setSaveError(null);
    };

    /* ========================================================= */
    /* Save                                                        */
    /* ========================================================= */

    const handleSave = async () => {
        if (!restaurantSlug) {
            return;
        }

        try {
            setIsSaving(true);
            setSaveError(null);

            const response = await apiClient.patch(
                `/owner/restaurants/${restaurantSlug}`,
                form,
            );

            const updatedRestaurant =
                response.data.data ??
                response.data;

            setRestaurant(updatedRestaurant);
            setIsEditing(false);

            /*
             * Updating the restaurant name can change
             * the slug on the backend.
             */
            if (
                updatedRestaurant.slug &&
                updatedRestaurant.slug !==
                restaurantSlug
            ) {
                window.location.href = "/owner/restaurant";
            }
        } catch (error) {
            console.error(
                "Failed to update restaurant:",
                error,
            );

            setSaveError(
                "Unable to save your changes. Please try again.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    /* ========================================================= */
    /* Loading                                                     */
    /* ========================================================= */

    if (isLoading) {
        return (
            <div className="w-full animate-pulse">
                <header className="mb-10">
                    <div className="h-3 w-28 rounded bg-[#EAE4DC]" />

                    <div className="mt-4 h-12 w-72 rounded bg-[#EAE4DC]" />

                    <div className="mt-4 h-4 w-[420px] max-w-full rounded bg-[#EEE9E2]" />
                </header>

                <div className="h-[280px] w-full rounded-2xl bg-[#EAE4DC] md:h-[360px]" />

                <div className="mt-6 rounded-2xl border border-[#EAE4DC] bg-white p-7">
                    <div className="h-6 w-48 rounded bg-[#EEE9E2]" />

                    <div className="mt-6 space-y-3">
                        <div className="h-4 w-full rounded bg-[#F2EEE9]" />
                        <div className="h-4 w-5/6 rounded bg-[#F2EEE9]" />
                        <div className="h-4 w-4/6 rounded bg-[#F2EEE9]" />
                    </div>
                </div>
            </div>
        );
    }

    /* ========================================================= */
    /* Error                                                       */
    /* ========================================================= */

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FCFAF7]">
                        <Store
                            className="h-5 w-5 text-[#A8A29E]"
                            strokeWidth={1.5}
                        />
                    </div>

                    <h2 className="mt-5 font-serif text-2xl font-medium text-[#292524]">
                        Something went wrong
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#78716C]">
                        {error}
                    </p>
                </div>
            </div>
        );
    }
    /* ========================================================= */
    /* No Restaurant                                               */
    /* ========================================================= */

    if (!restaurantSlug || !restaurant) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FCFAF7]">
                        <Store
                            className="h-5 w-5 text-[#A8A29E]"
                            strokeWidth={1.5}
                        />
                    </div>

                    <h2 className="mt-5 font-serif text-2xl font-medium tracking-[-0.025em] text-[#292524]">
                        No restaurant found
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#78716C]">
                        We couldn't find a restaurant
                        associated with your owner
                        account.
                    </p>
                </div>
            </div>
        );
    }


    const rating = Number(
        restaurant.average_rating || 0,
    );

    /* ========================================================= */
    /* Main Page                                                    */
    /* ========================================================= */

    return (
        <div className="w-full">
            {/* ===================================================== */}
            {/* Header                                                 */}
            {/* ===================================================== */}

            <header className="mb-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A8A29E]">
                            Restaurant level
                        </p>

                        <h1 className="font-serif text-4xl font-medium tracking-[-0.04em] text-[#292524] md:text-5xl">
                            {restaurant.name}
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-[#78716C]">
                            This profile is shared across all
                            branches of your restaurant.
                        </p>
                    </div>

                    {!isEditing && (
                        <Button
                            type="button"
                            onClick={handleEdit}
                            className="w-fit gap-2 rounded-xl"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit Restaurant
                        </Button>
                    )}
                </div>
            </header>

            {/* ===================================================== */}
            {/* Cover Image                                            */}
            {/* ===================================================== */}

            <div className="relative mx-auto aspect-[25/7] w-full  overflow-hidden rounded-2xl border border-[#EAE4DC] bg-[#FCFAF7]">
                {restaurant.image_url ? (
                    <img
                        src={restaurant.image_url}
                        alt={restaurant.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                            <ImageIcon
                                className="h-6 w-6 text-[#A8A29E]"
                                strokeWidth={1.4}
                            />
                        </div>
                    </div>
                )}

                {restaurant.is_published && (
                    <Badge className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#57534E] shadow-sm hover:bg-white">
                        Published
                    </Badge>
                )}
            </div>

            {/* ===================================================== */}
            {/* Profile Card                                           */}
            {/* ===================================================== */}

            <Card className="mt-6 rounded-2xl border-[#EAE4DC] bg-white p-7 shadow-[0_8px_30px_rgba(41,37,36,0.04)]">
                {!isEditing ? (
                    <>
                        {/* ================================================= */}
                        {/* View Mode                                          */}
                        {/* ================================================= */}

                        <div className="flex flex-col gap-8">
                            {/* Restaurant heading + rating */}

                            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="font-serif text-2xl font-semibold tracking-[-0.025em] text-[#292524]">
                                            {restaurant.name}
                                        </h2>

                                        {restaurant.cuisine_type && (
                                            <>
                                                <span className="h-1 w-1 rounded-full bg-[#A8A29E]" />

                                                <span className="text-sm text-[#78716C]">
                                                    {restaurant.cuisine_type}
                                                </span>
                                            </>
                                        )}

                                        {restaurant.location && (
                                            <>
                                                <span className="h-1 w-1 rounded-full bg-[#A8A29E]" />

                                                <span className="flex items-center gap-1 text-sm text-[#78716C]">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {restaurant.location}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Rating */}

                                <div className="flex shrink-0 items-start gap-8 md:text-right">
                                    <div>
                                        <div className="flex items-center gap-2 md:justify-end">
                                            <Star
                                                className="h-4 w-4 fill-primary text-primary"
                                                strokeWidth={1.2}
                                            />

                                            <span className="font-serif text-2xl font-semibold text-[#292524]">
                                                {rating > 0
                                                    ? rating.toFixed(1)
                                                    : "—"}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A8A29E]">
                                            {restaurant.review_count}{" "}
                                            reviews
                                        </p>
                                    </div>

                                    {restaurant.branch_count !==
                                        undefined && (
                                            <div>
                                                <p className="font-serif text-2xl font-semibold text-[#292524]">
                                                    {restaurant.branch_count}
                                                </p>

                                                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A8A29E]">
                                                    Branches
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Description */}

                            {restaurant.description && (
                                <p className="max-w-3xl text-sm leading-7 text-[#78716C]">
                                    {restaurant.description}
                                </p>
                            )}

                            {/* Ambiance */}

                            {restaurant.ambiance_tags?.length >
                                0 && (
                                    <>
                                        <div className="border-t border-[#EEE9E2]" />

                                        <div>
                                            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                                                Ambiance tags
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {restaurant.ambiance_tags.map(
                                                    (tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="outline"
                                                            className="rounded-full border-[#EAE4DC] bg-[#FCFAF7] px-3 py-1.5 text-xs font-normal text-[#57534E]"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                            {/* Contact */}

                            {(restaurant.email ||
                                restaurant.phone) && (
                                    <>
                                        <div className="border-t border-[#EEE9E2]" />

                                        <div>
                                            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                                                Contact
                                            </p>

                                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
                                                {restaurant.email && (
                                                    <div className="flex items-center gap-2 text-sm text-[#78716C]">
                                                        <Mail className="h-4 w-4 text-[#A8A29E]" />
                                                        {restaurant.email}
                                                    </div>
                                                )}

                                                {restaurant.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-[#78716C]">
                                                        <Phone className="h-4 w-4 text-[#A8A29E]" />
                                                        {restaurant.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* ================================================= */}
                        {/* Edit Mode                                          */}
                        {/* ================================================= */}

                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
                                    Restaurant details
                                </p>

                                <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.025em] text-[#292524]">
                                    Edit your profile
                                </h2>

                                <p className="mt-1 text-sm text-[#78716C]">
                                    Changes here apply to all branches.
                                </p>
                            </div>

                            {/* Form */}

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
                                            setForm({
                                                ...form,
                                                name: event.target.value,
                                            })
                                        }
                                        placeholder="Restaurant name"
                                    />
                                </div>

                                {/* Cuisine */}

                                <div className="space-y-2">
                                    <Label>Cuisine type</Label>

                                    <Select
                                        value={form.cuisine_type}
                                        onValueChange={(value) =>
                                            setForm({
                                                ...form,
                                                cuisine_type: value,
                                            })
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
                                            setForm({
                                                ...form,
                                                price_range: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select price range" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {priceRanges.map((price) => (
                                                <SelectItem
                                                    key={price}
                                                    value={price}
                                                >
                                                    {price}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Image URL */}

                                <div className="space-y-2">
                                    <Label htmlFor="restaurant-image">
                                        Cover image
                                    </Label>

                                    <Input
                                        id="restaurant-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];

                                            if (file) {
                                                // upload file
                                            }
                                        }}
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
                                            setForm({
                                                ...form,
                                                email: event.target.value,
                                            })
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
                                            setForm({
                                                ...form,
                                                phone: event.target.value,
                                            })
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
                                            setForm({
                                                ...form,
                                                description:
                                                    event.target.value,
                                            })
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
                                            setForm({
                                                ...form,
                                                ambiance_tags: value,
                                            })
                                        }
                                        suggestions={
                                            AMBIANCE_SUGGESTIONS
                                        }
                                        placeholder="Add an ambiance tag..."
                                    />
                                </div>
                            </div>

                            {/* Save error */}

                            {saveError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {saveError}
                                </div>
                            )}

                            {/* Actions */}

                            <div className="flex justify-end gap-3 border-t border-[#EEE9E2] pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="gap-2 rounded-xl border-[#EAE4DC]"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="gap-2 rounded-xl"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}