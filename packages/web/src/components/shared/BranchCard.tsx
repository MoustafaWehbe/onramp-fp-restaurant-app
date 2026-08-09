import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Star, ArrowRight } from "lucide-react";
import type { Branch } from "@/types/restaurant";

interface BranchCardProps {
  branch: Branch;
  restaurantSlug: string;
}

export function BranchCard({
  branch,
  restaurantSlug,
}: BranchCardProps) {
  const {
    name,
    slug,
    address,
    city,
    phone,
    opening_hours,
    review_count,
    average_rating,
  } = branch;

  return (
    <Link
      to={`/restaurants/${restaurantSlug}/branches/${slug}`}
      className="
        group block
        rounded-xl
        border border-border
        bg-card
        p-5
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-primary/40
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
          {name}
        </h3>

        {review_count > 0 && (
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
            <Star className="h-4 w-4 fill-primary text-primary" />
            {Number(average_rating).toFixed(1)}
            <span className="text-muted-foreground">
              ({review_count})
            </span>
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2.5 text-sm text-muted-foreground">
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            {address} · {city}
          </span>
        </p>

        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-primary" />
          <span>{phone}</span>
        </p>

        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-primary" />
          <span>{opening_hours}</span>
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-medium text-primary">
          View branch
        </span>

        <ArrowRight
          className="
            h-4 w-4
            text-primary
            transition-transform duration-300
            group-hover:translate-x-1
          "
        />
      </div>
    </Link>
  );
}