import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { restaurantsApi } from "@/services/restaurantsApi";
import type {
  Restaurant,
  RestaurantListResponse,
} from "@/types/restaurant";
import { HeroSearch } from "@/components/shared/HeroSearch";

export function Restaurants() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const city = searchParams.get("city");
  const cuisine = searchParams.get("cuisine");
  const priceRange = searchParams.get("priceRange");

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [meta, setMeta] = useState<RestaurantListResponse["meta"] | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = 12;

  useEffect(() => {
    let cancelled = false;

    async function loadRestaurants() {
      setIsLoading(true);
      setError(false);

      try {
        const hasFilters =
          Boolean(search) ||
          Boolean(city) ||
          Boolean(cuisine) ||
          Boolean(priceRange);

        const response = hasFilters
          ? await restaurantsApi.search({
              search,
              city,
              cuisine,
              priceRange,
              page,
              limit,
            })
          : await restaurantsApi.getAll({
              page,
              limit,
            });

        if (cancelled) return;

        setRestaurants(response.data);
        setMeta(response.meta);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load restaurants:", error);
        setError(true);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadRestaurants();

    return () => {
      cancelled = true;
    };
  }, [search, city, cuisine, priceRange, page]);

  return (
    <main className="min-h-screen bg-background">

      {/* Search Hero */}
      <HeroSearch />

      {/* Results */}
      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* Results Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-medium text-primary">
              {search || city || cuisine || priceRange
                ? "Search results"
                : "Discover"}
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              {search
                ? `Results for "${search}"`
                : "Restaurants"}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {meta?.total ?? 0}{" "}
              {(meta?.total ?? 0) === 1
                ? "restaurant"
                : "restaurants"}{" "}
              found
            </p>
          </div>

          {/* Current filters */}
          {(city || cuisine || priceRange) && (
            <div className="flex flex-wrap gap-2">
              {city && (
                <span className="rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                  {city}
                </span>
              )}

              {cuisine && (
                <span className="rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                  {cuisine}
                </span>
              )}

              {priceRange && (
                <span className="rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                  {priceRange}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              Something went wrong
            </h2>

            <p className="mt-2 text-muted-foreground">
              We couldn't load the restaurants. Please try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && restaurants.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              No restaurants found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              We couldn't find any restaurants matching your search.
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* Restaurant Grid */}
        {!isLoading && !error && restaurants.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))}
          </div>
        )}

        {/* Pagination placeholder */}
        {!isLoading && !error && meta && meta.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
