import { MapPin, Phone, Clock, Star } from "lucide-react";
import type { Branch } from "@/types/restaurant";

interface BranchCardProps {
  branch: Branch;
}

export function BranchCard({ branch }: BranchCardProps) {
  const { name, address, city, phone, opening_hours, reviews } = branch;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-foreground">{name}</h3>
        {avgRating !== null && (
          <span className="flex items-center gap-1 text-sm font-medium text-primary">
            <Star className="h-4 w-4 fill-primary text-primary" />
            {avgRating.toFixed(1)}
            <span className="text-muted-foreground">({reviews.length})</span>
          </span>
        )}
      </div>

      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{address} · {city}</span>
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
    </div>
  );
}