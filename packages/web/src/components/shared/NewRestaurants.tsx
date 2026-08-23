import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { RestaurantCard } from "@/components/shared/RestaurantCard";
import { restaurantsApi } from "@/services/restaurantsApi";

export function NewRestaurants() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurants", "featured"],
    queryFn: () => restaurantsApi.getAll({ page: 1, limit: 8 }),
  });

  const restaurants = data?.data ?? [];

  return (
    <section className="w-full px-8 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary sm:text-3xl">
          New on Platera
        </h2>

        <Link
          to="/restaurants"
          className="flex items-center gap-5 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-[420px] animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-border p-8 text-center">
          <p className="text-muted-foreground">
            Unable to load restaurants right now.
          </p>
        </div>
      )}

      {!isLoading && !isError && restaurants.length === 0 && (
        <div className="rounded-xl border border-border p-8 text-center">
          <p className="text-muted-foreground">
            No restaurants available yet.
          </p>
        </div>
      )}

      {!isLoading && !isError && restaurants.length > 0 && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
      )}
    </section>
  );
}