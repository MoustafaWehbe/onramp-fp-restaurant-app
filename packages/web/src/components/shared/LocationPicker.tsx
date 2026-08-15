import { useCallback, useState } from "react";
import {
    Clipboard,
    Loader2,
    LocateFixed,
    MapPin,
} from "lucide-react";

import { apiClient } from "@/lib/api-client";

interface Location {
    latitude: string;
    longitude: string;
}

interface LocationPickerProps {
    restaurantSlug: string;
    value: Location;
    onChange: (location: Location) => void;
    onProcessingChange?: (isProcessing: boolean) => void;
}

export function LocationPicker({
    restaurantSlug,
    value,
    onChange,
    onProcessingChange,
}: LocationPickerProps) {
    const [googleMapsUrl, setGoogleMapsUrl] =
        useState("");

    const [isProcessing, setIsProcessing] =
        useState(false);

    const [locationError, setLocationError] =
        useState<string | null>(null);

    const hasLocation =
        value.latitude !== "" &&
        value.longitude !== "";

    const handleGoogleMapsUrl = useCallback(
        async () => {
            const url = googleMapsUrl.trim();

            if (!url) {
                setLocationError(
                    "Please paste a Google Maps link.",
                );
                return;
            }

            if (!restaurantSlug) {
                setLocationError(
                    "Restaurant information is missing.",
                );
                return;
            }

            try {
                setIsProcessing(true);
                onProcessingChange?.(true);
                setLocationError(null);

                const response =
                    await apiClient.post(
                        `/owner/restaurants/${encodeURIComponent(
                            restaurantSlug,
                        )}/google-maps`,
                        {
                            url,
                        },
                    );

                const {
                    latitude,
                    longitude,
                } = response.data.data;

                onChange({
                    latitude:
                        latitude.toString(),
                    longitude:
                        longitude.toString(),
                });

                setGoogleMapsUrl("");
            } catch (error: any) {
                console.error(
                    "Google Maps location error:",
                    error,
                );
                const message =
                    error?.response?.data?.message ??
                    error?.response?.data?.error ??
                    "Unable to process this Google Maps link. Please try again.";

                setLocationError(message);
            } finally {
                setIsProcessing(false);
                onProcessingChange?.(false);
            }
        },
        [
            googleMapsUrl,
            restaurantSlug,
            onChange,
        ],
    );

    return (
        <div className="w-full space-y-4">
            {/* Header */}
            <div>
                <p className="text-sm font-medium text-[#292524]">
                    Branch location
                </p>

                <p className="mt-1 text-sm leading-6 text-[#78716C]">
                    Share your branch location
                    directly from Google Maps.
                </p>
            </div>

            {/* Google Maps Link */}
            <div className="rounded-2xl border border-[#EAE4DC] bg-[#FCFAF7] p-4">
                <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                    </span>

                    <div>
                        <p className="text-sm font-medium text-[#292524]">
                            Share from Google Maps
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#78716C]">
                            Open Google Maps, find your
                            branch, tap{" "}
                            <span className="font-medium text-[#57534E]">
                                Share
                            </span>
                            , copy the link, and paste it
                            below.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <div className="relative min-w-0 flex-1">
                        <Clipboard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8A29E]" />

                        <input
                            type="url"
                            value={googleMapsUrl}
                            onChange={(event) => {
                                setGoogleMapsUrl(
                                    event.target.value,
                                );

                                if (locationError) {
                                    setLocationError(null);
                                }
                            }}
                            onKeyDown={(event) => {
                                if (
                                    event.key ===
                                    "Enter"
                                ) {
                                    event.preventDefault();

                                    if (
                                        !isProcessing &&
                                        googleMapsUrl.trim()
                                    ) {
                                        handleGoogleMapsUrl();
                                    }
                                }
                            }}
                            placeholder="Paste Google Maps link..."
                            className="
                                h-11
                                w-full
                                rounded-xl
                                border
                                border-[#EAE4DC]
                                bg-white
                                pl-10
                                pr-4
                                text-sm
                                text-[#292524]
                                outline-none
                                transition
                                placeholder:text-[#A8A29E]
                                focus:border-primary
                                focus:ring-2
                                focus:ring-primary/10
                            "
                        />
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleGoogleMapsUrl
                        }
                        disabled={
                            isProcessing ||
                            !googleMapsUrl.trim() ||
                            !restaurantSlug
                        }
                        className="
                            inline-flex
                            h-11
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-primary
                            px-5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-primary/90
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <MapPin className="h-4 w-4" />
                        )}

                        Use location
                    </button>
                </div>
            </div>

            {/* Error */}
            {locationError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                    {locationError}
                </div>
            )}

            {/* Selected Location */}
            {hasLocation && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <LocateFixed className="h-3.5 w-3.5 text-emerald-600" />
                    </span>

                    <div className="min-w-0">
                        <p className="text-sm font-medium text-emerald-800">
                            Location selected
                        </p>

                        <p className="mt-0.5 text-xs text-emerald-700">
                            Latitude:{" "}
                            {Number(
                                value.latitude,
                            ).toFixed(6)}{" "}
                            · Longitude:{" "}
                            {Number(
                                value.longitude,
                            ).toFixed(6)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}