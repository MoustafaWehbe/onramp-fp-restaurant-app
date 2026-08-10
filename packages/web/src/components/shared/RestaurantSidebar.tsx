import { Mail, Phone, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RestaurantDetails } from "@/types/restaurant";

interface RestaurantSidebarProps {
  restaurant: RestaurantDetails;
}

export function RestaurantSidebar({ restaurant }: RestaurantSidebarProps) {
  const { email, phone, price_range, ambiance_tags } = restaurant;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Restaurant info</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{phone}</span>
        </div>

        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{email}</span>
        </div>

        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <Tag className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>Price range: {price_range}</span>
        </div>

        {ambiance_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {ambiance_tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}