import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RestaurantCard } from "@/components/shared/RestaurantCard";
import { MOCK_FEATURED_RESTAURANTS } from "@/data/mockRestaurants";
// TODO(api): swap MOCK_FEATURED_RESTAURANTS for a real fetch, e.g.
//   const { data: restaurants } = useQuery(["restaurants", "featured"], restaurantsApi.getFeatured);
// once GET /restaurants/featured is ready. RestaurantCard already expects
// the Restaurant[] shape defined in src/types/restaurant.ts, so the render
// below won't need to change.

export function FeaturedRestaurants() {
    const restaurants = MOCK_FEATURED_RESTAURANTS;

    return (
        <section className="w-full px-8 py-16">      <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
                Featured this week
            </h2>
            <Link
                to="/restaurants"
                className="flex items-center gap-5 text-sm font-medium text-primary hover:underline"
            >
                View all
                <ArrowRight className="h-4 w-4" />
            </Link>
        </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
            </div>
        </section>
    );
}
