import { useEffect, useState } from "react";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { favoritesApi } from "@/services/favoritesApi";
import type { Restaurant } from "@/types/restaurant";

export function SavedRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSavedRestaurants() {
      setIsLoading(true);
      setError(false);

      try {
        const response = await favoritesApi.getFavorites();

        if (cancelled) return;

        setRestaurants(response);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load saved restaurants:", error);
        setError(true);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSavedRestaurants();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">
            Your collection
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Saved Restaurants
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {restaurants.length}{" "}
            {restaurants.length === 1 ? "restaurant" : "restaurants"} saved
          </p>
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
              We couldn't load your saved restaurants. Please try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && restaurants.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              No saved restaurants
            </h2>

            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Restaurants you save will appear here so you can easily find
              them later.
            </p>
          </div>
        )}

        {/* Restaurant Grid */}
        {!isLoading && !error && restaurants.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}