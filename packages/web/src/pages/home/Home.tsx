import { HeroSearch } from "@/components/shared/HeroSearch";
import { StatsBar } from "@/components/shared/StatsBar";
import { FeaturedRestaurants } from "@/components/shared/FeaturedRestaurants";
import { HowItWorks } from "@/components/shared/HowItWorks";
import { OwnerCta } from "@/components/shared/OwnerCta";
import { RestaurantCta } from "@/components/shared/RestaurantCta";

export default function Home() {
  return (
    <main>
      <HeroSearch />
      <StatsBar />
      <FeaturedRestaurants />
      <HowItWorks />
        <RestaurantCta/>
      <OwnerCta />
    </main>
  );
}