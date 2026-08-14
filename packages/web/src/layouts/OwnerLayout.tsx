import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ExternalLink } from "lucide-react";

import { OwnerSidebar } from "@/components/shared/OwnerSideBar";
import { apiClient } from "@/lib/api-client";

export interface OwnerOutletContext {
    restaurantId: string | null;
    restaurantSlug: string | null;
    restaurantName: string | null;
    reviewCount: number;
    averageRating: number;
    userName: string;
}

interface User {
    name: string;
}

interface RestaurantClaim {
    restaurantId: string | null;
    restaurantName: string | null;
    restaurantSlug: string | null;
    status: string;
}

export function OwnerLayout() {
    const [userName, setUserName] = useState("");

    const [restaurantId, setRestaurantId] =
        useState<string | null>(null);

    const [restaurantSlug, setRestaurantSlug] =
        useState<string | null>(null);

    const [restaurantName, setRestaurantName] =
        useState<string | null>(null);
    const [reviewCount, setReviewCount] = useState(0);

    const [averageRating, setAverageRating] =
        useState(0);

    useEffect(() => {
        const loadOwnerData = async () => {
            try {
                const userResponse =
                    await apiClient.get("/auth/me");

                const user: User =
                    userResponse.data.data;

                setUserName(user.name);

                const claimResponse =
                    await apiClient.get(
                        "/restaurant-claims/",
                    );

                const claim: RestaurantClaim =
                    claimResponse.data.data;

                if (claim.restaurantId && claim.restaurantSlug) {
                    setRestaurantId(claim.restaurantId);

                    setRestaurantSlug(claim.restaurantSlug);

                    setRestaurantName(claim.restaurantName);

                    const restaurantResponse =
                        await apiClient.get(
                            `/owner/restaurants/${claim.restaurantSlug}`,
                        );

                    const restaurant =
                        restaurantResponse.data.data;

                    setReviewCount(
                        Number(restaurant.review_count || 0),
                    );

                    setAverageRating(
                        Number(restaurant.average_rating || 0),
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load owner data:",
                    error,
                );
            }
        };

        loadOwnerData();
    }, []);

    return (
        <div className="h-screen overflow-hidden bg-[#FAF8F4] text-[#292524]">


            <OwnerSidebar userName={userName}
                restaurantSlug={restaurantSlug}
            />

            <div className="ml-[400px] flex h-screen min-w-0 flex-col">

                {/* ================================================= */}
                {/* Top Bar                                             */}
                {/* ================================================= */}

                <header className="flex h-[72px] shrink-0 items-center justify-end border-b border-[#EAE4DC] bg-white/90 px-10 backdrop-blur-sm">
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = "/";
                        }}
                        className="group inline-flex items-center gap-2 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-xs font-medium text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                    >
                        <span>Visit Website</span>

                        <ExternalLink
                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            strokeWidth={1.7}
                        />
                    </button>
                </header>

                <main className="min-h-0 flex-1 overflow-y-auto">
                    <div className="px-12 py-10">
                        <Outlet
                            context={{
                                restaurantId,
                                restaurantSlug,
                                restaurantName,
                                reviewCount,
                                averageRating,
                                userName,
                            }}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}