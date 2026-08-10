import { memo } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Restaurant } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard = memo(function RestaurantCard({
  restaurant,
}: RestaurantCardProps) {
  const {
    slug,
    name,
    cuisine_type,
    price_range,
    average_rating,
    review_count,
    image_url,
  } = restaurant;

  return (
    <Link
      to={`/restaurants/${slug}`}
      className="
        group block min-h-[420px]
        overflow-hidden rounded-2xl
        border border-border bg-card
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-primary/40
        hover:shadow-xl
      "
    >
      {/* Restaurant image */}
      <div className="relative h-72 w-full overflow-hidden bg-muted">
        <img
          src={image_url}
          alt={name}
          loading="lazy"
          className="
            h-full w-full object-cover
            transition-transform duration-300
            group-hover:scale-105
          "
        />

        {/* Cuisine badge */}
        <span
          className="
            absolute left-4 top-4
            rounded-full
            bg-background/90
            px-4 py-1.5
            text-sm font-medium
            text-primary
            shadow-sm
            backdrop-blur-sm
          "
        >
          {cuisine_type}
        </span>

        {/* Rating badge */}
        <span
          className="
            absolute right-4 top-4
            flex items-center gap-1.5
            rounded-full
            bg-background/90
            px-4 py-1.5
            text-sm font-semibold
            text-foreground
            shadow-sm
            backdrop-blur-sm
          "
        >
          <Star className="h-4 w-4 fill-primary text-primary" />
          {average_rating.toFixed(1)}
        </span>
      </div>

      {/* Restaurant information */}
      <div className="space-y-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-xl font-semibold text-foreground">
            {name}
          </h3>

          <span
            className="
              shrink-0
              rounded-md
              bg-primary/10
              px-3 py-1
              text-sm font-medium
              text-primary
            "
          >
            {price_range}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          {review_count.toLocaleString()} reviews
        </p>
      </div>
    </Link>
  );
});