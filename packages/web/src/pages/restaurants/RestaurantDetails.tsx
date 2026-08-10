import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  Star,
  Utensils,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { RestaurantSidebar } from "@/components/shared/RestaurantSidebar";
import { BranchCard } from "@/components/shared/BranchCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { restaurantsApi } from "@/services/restaurantsApi";
import ReviewCard from "@/components/shared/ReviewCard";
import Reviews from "@/components/shared/Reviews";
import MenusSection from "@/components/shared/MenuSection";

export function RestaurantDetails() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: restaurant,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurant", slug],
    queryFn: () => restaurantsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !restaurant) {
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

  const allReviews = restaurant.branches.flatMap(
    (branch) => branch.reviews
  );

  return (
    <main className="mx-auto max-w-9xl px-6 py-8">
      {/* Back */}
      <Link
        to="/restaurants"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to restaurants
      </Link>

      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image */}
          <div className="relative h-[320px] lg:h-[500px]">
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
              <Badge className="bg-background/90 text-foreground backdrop-blur">
                {restaurant.cuisine_type}
              </Badge>

              <Badge className="bg-background/90 text-foreground backdrop-blur">
                {restaurant.price_range}
              </Badge>
            </div>
          </div>

          {/* Restaurant information */}
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">
                {restaurant.cuisine_type}
              </Badge>

              <span className="text-sm text-muted-foreground">
                {restaurant.branches.length}{" "}
                {restaurant.branches.length === 1
                  ? "branch"
                  : "branches"}
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {restaurant.name}
            </h1>

            {/* Rating */}
            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2">
                <Star className="h-5 w-5 fill-primary text-primary" />

                <span className="font-semibold text-primary">
                  {Number(restaurant.average_rating).toFixed(1)}
                </span>
              </div>

              <span className="text-sm text-muted-foreground">
                {restaurant.review_count.toLocaleString()} reviews
              </span>
            </div>

            <p className="mt-6 leading-relaxed text-muted-foreground">
              {restaurant.description}
            </p>

            {/* Ambiance */}
            {restaurant.ambiance_tags.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-foreground">
                  Atmosphere
                </p>

                <div className="flex flex-wrap gap-2">
                  {restaurant.ambiance_tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded-full px-3 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="truncate text-sm font-medium text-foreground">
                    {restaurant.phone}
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${restaurant.email}`}
                className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="truncate text-sm font-medium text-foreground">
                    {restaurant.email}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          {/* Branches */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Locations
                </h2>

                <p className="text-sm text-muted-foreground">
                  Find a {restaurant.name} branch near you
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {restaurant.branches.map((branch) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  restaurantSlug={restaurant.slug}
                />
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-foreground">
              Customer Reviews
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              What diners are saying about {restaurant.name}
            </p>
          </div>

          <Reviews
            reviews={allReviews}
            onUpdate={() => {}}
            onDelete={() => {}}
          />
        </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <RestaurantSidebar restaurant={restaurant} />
        </aside>
      </div>
    </main>
  );
}