import { useEffect, useState } from "react";
import {
  BookOpen,
  Building2,
  Loader2,
  MapPin,
  Star,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

import { apiClient } from "@/lib/api-client";
import type { OwnerOutletContext } from "@/layouts/OwnerLayout";

interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  average_rating: number | string;
  review_count: number;
}

export function OwnerDashboard() {

  const {
    restaurantSlug,
    userName,
    reviewCount,
    averageRating,
  } = useOutletContext<OwnerOutletContext>();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantSlug) {
      setIsLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get(
          `/owner/restaurants/${restaurantSlug}/branches`,
        );

        setBranches(response.data.data ?? []);
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error,
        );

        setError(
          "Unable to load your dashboard data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [restaurantSlug]);



  /*
   * The branch API currently doesn't expose an
   * "is open" value. Therefore we don't invent
   * an open-branch count.
   */
  const openBranches = null;

  /* ========================================================= */
  /* Loading                                                   */
  /* ========================================================= */

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />

          <span className="text-sm">
            Loading your workspace...
          </span>
        </div>
      </div>
    );
  }

  /* ========================================================= */
  /* No Restaurant                                             */
  /* ========================================================= */

  if (!restaurantSlug) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-[#E7E0D7] bg-white px-10 py-8 text-center shadow-[0_8px_30px_rgba(41,37,36,0.04)]">
          <h2 className="font-serif text-xl text-foreground">
            No restaurant found
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            We couldn't find a restaurant
            associated with your owner
            account.
          </p>
        </div>
      </div>
    );
  }

  /* ========================================================= */
  /* Error                                                      */
  /* ========================================================= */

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-[#E7E0D7] bg-white px-10 py-8 text-center shadow-[0_8px_30px_rgba(41,37,36,0.04)]">
          <h2 className="font-serif text-xl text-foreground">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>
        </div>
      </div>
    );
  }

  /* ========================================================= */
  /* Dashboard                                                  */
  /* ========================================================= */

  return (
    <div className="w-full">
      {/* ================================================= */}
      {/* Page Header                                        */}
      {/* ================================================= */}

      <header className="mb-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#78716C]">
              Overview
            </p>
            <h1 className="font-serif text-4xl font-medium tracking-[-0.04em] text-[#292524] md:text-5xl">
              Hello, {userName || "there"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#78716C]">
              Manage your restaurants,
              branches and menus from one
              place.
            </p>
          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* Statistics Cards                                  */}
      {/* ================================================= */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          label="Branches"
          value={branches.length.toString()}
          caption="Active locations"
          icon={MapPin}
        />

        <StatCard
          label="Menus"
          value="—"
          caption="Menu management"
          icon={BookOpen}
          unavailable
        />

        <StatCard
          label="Average Rating"
          value={
            averageRating > 0
              ? averageRating.toFixed(1)
              : "—"
          }
          caption={`${reviewCount} total reviews`}
          icon={Star}
          showTrend={false}
          rating={averageRating > 0}
        />

      </section>


      {/* ================================================= */ }
  {/* Branch Performance                                */ }
  {/* ================================================= */ }

  <section className="mt-10">
    <div className="mb-5">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#78716C]">
        Performance
      </p>

      <h2 className="font-serif text-2xl font-semibold tracking-[-0.025em] text-[#292524]">
        Branch Performance
      </h2>

      <p className="mt-1 text-sm text-[#78716C]">
        Reviews and ratings by branch.
      </p>
    </div>

    <div className="overflow-hidden rounded-2xl border border-[#E7E0D7] bg-white shadow-[0_8px_30px_rgba(41,37,36,0.04)]">
      {branches.length === 0 ? (
        <EmptyBranches />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-[#EEE9E2] bg-[#FCFAF7]">
                <th className="px-7 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#78716C]">
                  Branch
                </th>

                <th className="px-7 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-[#78716C]">
                  Avg. Rating
                </th>

                <th className="px-7 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-[#78716C]">
                  No. of Reviews
                </th>
              </tr>
            </thead>

            <tbody>
              {branches.map(
                (branch) => {
                  const rating =
                    Number(
                      branch.average_rating ||
                      0,
                    );

                  return (
                    <tr
                      key={
                        branch.id
                      }
                      className="border-b border-[#F0EBE5] last:border-0 transition-colors hover:bg-[#FCFAF7]"
                    >
                      {/* Branch */}

                      <td className="px-7 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF1E8]">
                            <Building2
                              className="h-4 w-4 text-primary"
                              strokeWidth={
                                1.6
                              }
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-serif text-[15px] font-semibold text-[#292524]">
                                {
                                  branch.name
                                }
                              </p>

                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </div>

                            <p className="mt-1 text-xs text-[#78716C]">
                              {
                                branch.city
                              }

                              {branch.address &&
                                ` · ${branch.address}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Rating */}

                      <td className="px-7 py-6">
                        <div className="inline-flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF1E8]">
                            <Star
                              className="h-3.5 w-3.5 fill-primary text-primary"
                              strokeWidth={
                                1.2
                              }
                            />
                          </div>

                          <span className="font-serif text-base font-semibold text-[#292524]">
                            {rating
                              ? rating.toFixed(
                                1,
                              )
                              : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Reviews */}

                      <td className="px-7 py-6 text-right">
                        <span className="font-serif text-base font-semibold text-[#292524]">
                          {
                            branch.review_count
                          }
                        </span>

                        <span className="ml-2 text-xs text-[#78716C]">
                          reviews
                        </span>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </section>
    </div >
  );
}

/* ========================================================= */
/* Stat Card                                                  */
/* ========================================================= */

function StatCard({
  label,
  value,
  caption,
  icon: Icon,
  unavailable = false,
  showTrend = false,
  rating = false,
}: {
  label: string;
  value: string;
  caption: string;
  icon: React.ElementType;
  unavailable?: boolean;
  showTrend?: boolean;
  rating?: boolean;
}) {
  return (
    <div className="group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-2xl border border-[#E7E0D7] bg-white p-6 shadow-[0_8px_30px_rgba(41,37,36,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(41,37,36,0.07)]">
      {/* Decorative orange glow */}

      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/[0.035] blur-2xl transition-all duration-300 group-hover:bg-primary/[0.07]" />

      {/* Top */}

      <div className="relative flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#78716C]">
          {label}
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF1E8]">
          <Icon
            className="h-[18px] w-[18px] text-primary"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Number */}

      <div className="relative mt-6">
        <span
          className={`font-serif text-5xl font-semibold tracking-[-0.045em] ${unavailable
            ? "text-[#A8A29E]"
            : "text-[#292524]"
            }`}
        >
          {value}
        </span>
      </div>

      {/* Bottom */}

      <div className="relative mt-5 flex min-h-[20px] items-center gap-2">
        {rating && (
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        )}

        <span className="text-xs text-[#78716C]">
          {caption}
        </span>

        {showTrend && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
            ↗ 2.1%
          </span>
        )}
      </div>
    </div>
  );
}

/* ========================================================= */
/* Empty Branches                                             */
/* ========================================================= */

function EmptyBranches() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF1E8]">
        <Building2
          className="h-5 w-5 text-primary"
          strokeWidth={1.4}
        />
      </div>

      <h3 className="mt-5 font-serif text-xl font-medium text-[#292524]">
        No branches yet
      </h3>

      <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-[#78716C]">
        Add your first branch to begin
        tracking its performance.
      </p>
    </div>
  );
}