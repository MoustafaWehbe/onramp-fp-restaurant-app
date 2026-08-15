import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Clock,
    MapPin,
    Menu,
    Phone,
    ArrowRight,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import type { Branch } from "@/types/restaurant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface OwnerBranchCardProps {
    branch: Branch;
    restaurantSlug: string;
}

export function OwnerBranchCard({
    branch,
    restaurantSlug,
}: OwnerBranchCardProps) {
    const {
        name,
        slug,
        address,
        city,
        phone,
        opening_hours,
        images,
    } = branch;

    const [currentImage, setCurrentImage] = useState(0);

    /*
     * The current Branch type does not expose
     * these fields yet, so keep them optional.
     */
    const isOpen = (
        branch as Branch & {
            isOpen?: boolean;
        }
    ).isOpen;

    const menuAvailable = (
        branch as Branch & {
            menu_available?: boolean;
        }
    ).menu_available;

    const branchImages = images ?? [];

    const hasMultipleImages =
        branchImages.length > 1;

    const nextImage = () => {
        setCurrentImage((current) =>
            current === branchImages.length - 1
                ? 0
                : current + 1,
        );
    };

    const previousImage = () => {
        setCurrentImage((current) =>
            current === 0
                ? branchImages.length - 1
                : current - 1,
        );
    };

    return (
        <Card className="group overflow-hidden rounded-2xl border-[#EAE4DC] bg-white shadow-[0_8px_30px_rgba(41,37,36,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(41,37,36,0.08)]">
            {/* Image */}

            <div className="relative aspect-[16/9] overflow-hidden bg-[#FCFAF7]">
                {branchImages.length > 0 ? (
                    <>
                        <img
                            src={
                                branchImages[
                                    currentImage
                                ].url
                            }
                            alt={`${name} ${
                                currentImage + 1
                            }`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />

                        {/* Previous */}

                        {hasMultipleImages && (
                            <button
                                type="button"
                                onClick={
                                    previousImage
                                }
                                aria-label="Previous image"
                                className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#292524] shadow-md transition hover:bg-white"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        )}

                        {/* Next */}

                        {hasMultipleImages && (
                            <button
                                type="button"
                                onClick={nextImage}
                                aria-label="Next image"
                                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#292524] shadow-md transition hover:bg-white"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        )}

                        {/* Image indicators */}

                        {hasMultipleImages && (
                            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/40 px-2.5 py-1.5">
                                {branchImages.map(
                                    (image, index) => (
                                        <button
                                            key={
                                                image.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                setCurrentImage(
                                                    index,
                                                )
                                            }
                                            aria-label={`View image ${
                                                index +
                                                1
                                            }`}
                                            className={`h-1.5 rounded-full transition-all ${
                                                index ===
                                                currentImage
                                                    ? "w-4 bg-white"
                                                    : "w-1.5 bg-white/60"
                                            }`}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                            <ImageIcon
                                className="h-5 w-5 text-[#A8A29E]"
                                strokeWidth={1.4}
                            />
                        </div>
                    </div>
                )}

                {/* Status */}

                {isOpen !== undefined && (
                    <Badge
                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] shadow-sm ${
                            isOpen
                                ? "bg-white text-emerald-700 hover:bg-white"
                                : "bg-white text-[#78716C] hover:bg-white"
                        }`}
                    >
                        {isOpen
                            ? "Open"
                            : "Closed"}
                    </Badge>
                )}
            </div>

            {/* Content */}

            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="font-serif text-xl font-semibold tracking-[-0.025em] text-[#292524]">
                            {name}
                        </h3>

                        {city && (
                            <p className="mt-1 text-sm text-[#A8A29E]">
                                {city}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-[#78716C]">
                    {address && (
                        <div className="flex items-start gap-2.5">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                            <span>
                                {address}
                                {city
                                    ? ` · ${city}`
                                    : ""}
                            </span>
                        </div>
                    )}

                    {phone && (
                        <div className="flex items-center gap-2.5">
                            <Phone className="h-4 w-4 shrink-0 text-primary" />

                            <span>
                                {phone}
                            </span>
                        </div>
                    )}

                    {opening_hours && (
                        <div className="flex items-start gap-2.5">
                            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                            <span>
                                {opening_hours}
                            </span>
                        </div>
                    )}

                    {menuAvailable !==
                        undefined && (
                        <div className="flex items-center gap-2.5">
                            <Menu className="h-4 w-4 shrink-0 text-primary" />

                            <span>
                                {menuAvailable
                                    ? "Menu available"
                                    : "No menu added"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Manage */}

                <div className="mt-6 border-t border-[#EEE9E2] pt-4">
                    <Button
                        asChild
                        className="w-full gap-2 rounded-xl"
                    >
                        <Link
                            to={`/owner/${restaurantSlug}/branches/${slug}`}
                        >
                            Manage Branch

                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}