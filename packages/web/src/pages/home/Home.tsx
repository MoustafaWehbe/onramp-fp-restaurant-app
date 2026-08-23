import { HeroSearch } from "@/components/shared/HeroSearch";
import { StatsBar } from "@/components/shared/StatsBar";
import { NewRestaurants } from "@/components/shared/NewRestaurants";
import { HowItWorks } from "@/components/shared/HowItworks";
import { OwnerCta } from "@/components/shared/OwnerCta";
import { RestaurantCta } from "@/components/shared/RestaurantCta";

export default function Home() {
  return (
    <main>
      <HeroSearch />
      <StatsBar />
      <NewRestaurants />
      <HowItWorks />
        <RestaurantCta/>
      <OwnerCta />
    </main>
  );
}