import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RestaurantSidebar } from "@/components/shared/RestaurantSidebar";
import { BranchCard } from "@/components/shared/BranchCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { restaurantsApi } from "@/services/restaurantsApi";
import type { RestaurantDetails as RestaurantDetailsType } from "@/types/restaurant";

export function RestaurantDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const currentSlug = slug;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(false);
      try {
        const data = await restaurantsApi.getBySlug(currentSlug);
        if (!cancelled) setRestaurant(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Restaurant not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The restaurant you're looking for doesn't exist or was removed.
        </p>
        <Link
          to="/restaurants"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to restaurants
        </Link>
      </div>
    );
  }

  const { name, description, cuisine_type, branches, menus } = restaurant;

  const allReviews = branches.flatMap((b) => b.reviews);
  const avgRating =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Link
        to="/restaurants"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to restaurants
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {name}
          </h1>
          <Badge variant="secondary">{cuisine_type}</Badge>
        </div>

        {avgRating !== null && (
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{avgRating.toFixed(1)}</span>{" "}
            average rating · {allReviews.length} reviews across {branches.length} branches
          </p>
        )}

        <p className="mt-5 max-w-2xl text-muted-foreground">{description}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Menu</h2>
            <div className="flex flex-wrap gap-3">
              {menus.map((menu) => (
                <span
                  key={menu.id}
                  className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm"
                >
                  {menu.name}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Branches</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {branches.map((branch) => (
                <BranchCard key={branch.id} branch={branch} />
              ))}
            </div>
          </section>

          {allReviews.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Reviews</h2>
              <div className="space-y-4">
                {allReviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{review.user.name}</p>
                      <span className="text-sm font-medium text-primary">{review.rating}★</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <RestaurantSidebar restaurant={restaurant} />
      </div>
    </div>
  );
}