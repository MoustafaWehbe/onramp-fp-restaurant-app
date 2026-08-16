import { useEffect, useState } from "react";
import {
    Building2,
    Loader2,
    Plus,
} from "lucide-react";
import {
    useNavigate,
    useOutletContext,
} from "react-router-dom";

import { apiClient } from "@/lib/api-client";
import type { OwnerOutletContext } from "@/layouts/OwnerLayout";
import type { Branch } from "@/types/restaurant";

import { Button } from "@/components/ui/button";
import { OwnerBranchCard } from "@/components/shared/OwnerBranchCard";

export function OwnerBranchesPage() {
    const navigate = useNavigate();

    const { restaurantSlug } =
        useOutletContext<OwnerOutletContext>();

    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!restaurantSlug) {
            setIsLoading(false);
            return;
        }

        const loadBranches = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await apiClient.get(
                    `/owner/restaurants/${restaurantSlug}/branches`,
                );

                setBranches(
                    response.data.data ??
                        response.data ??
                        [],
                );
            } catch (error) {
                console.error(
                    "Failed to load branches:",
                    error,
                );

                setError(
                    "Unable to load your restaurant branches.",
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadBranches();
    }, [restaurantSlug]);

    /* ========================================================= */
    /* Loading                                                     */
    /* ========================================================= */

    if (isLoading) {
        return (
            <div className="w-full">
                <header className="mb-10">
                    <div className="h-3 w-24 animate-pulse rounded bg-[#EAE4DC]" />

                    <div className="mt-4 h-12 w-64 animate-pulse rounded bg-[#EAE4DC]" />

                    <div className="mt-4 h-4 w-[420px] max-w-full animate-pulse rounded bg-[#EEE9E2]" />
                </header>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="overflow-hidden rounded-2xl border border-[#EAE4DC] bg-white"
                        >
                            <div className="aspect-[16/9] animate-pulse bg-[#EAE4DC]" />

                            <div className="space-y-4 p-5">
                                <div className="h-6 w-36 animate-pulse rounded bg-[#EEE9E2]" />

                                <div className="h-4 w-full animate-pulse rounded bg-[#F2EEE9]" />

                                <div className="h-4 w-4/5 animate-pulse rounded bg-[#F2EEE9]" />

                                <div className="h-10 w-full animate-pulse rounded-xl bg-[#EEE9E2]" />
                            </div>
                        </div>
                    ))}
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
                        <Building2
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
    /* No restaurant                                               */
    /* ========================================================= */

    if (!restaurantSlug) {
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
                        No restaurant found
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#78716C]">
                        We couldn't find a restaurant
                        associated with your owner account.
                    </p>
                </div>
            </div>
        );
    }

    /* ========================================================= */
    /* Main Page                                                    */
    /* ========================================================= */

    return (
        <div className="w-full">
            {/* Header */}

            <header className="mb-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A8A29E]">
                            Branch management
                        </p>

                        <h1 className="font-serif text-4xl font-medium tracking-[-0.04em] text-[#292524] md:text-5xl">
                            Branches
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-[#78716C]">
                            Manage the locations, contact details,
                            opening hours, and menus for your
                            restaurant branches.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/owner/${restaurantSlug}/branches`,
                            )
                        }
                        className="w-fit gap-2 rounded-xl"
                    >
                        <Plus className="h-4 w-4" />
                        Add Branch
                    </Button>
                </div>
            </header>

            {/* Empty */}

            {branches.length === 0 ? (
                <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-[#EAE4DC] bg-[#FCFAF7]">
                    <div className="max-w-sm text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                            <Building2
                                className="h-6 w-6 text-[#A8A29E]"
                                strokeWidth={1.4}
                            />
                        </div>

                        <h2 className="mt-5 font-serif text-2xl font-medium tracking-[-0.025em] text-[#292524]">
                            No branches yet
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#78716C]">
                            Add your first branch to start managing
                            its location, opening hours, and menu.
                        </p>

                        <Button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/owner/${restaurantSlug}/branches`,
                                )
                            }
                            className="mt-6 gap-2 rounded-xl"
                        >
                            <Plus className="h-4 w-4" />
                            Add Branch
                        </Button>
                    </div>
                </div>
            ) : (
                /* Branches */

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {branches.map((branch) => (
                        <OwnerBranchCard
                            key={branch.id}
                            branch={branch}
                            restaurantSlug={restaurantSlug}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}