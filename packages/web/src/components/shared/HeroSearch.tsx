import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CuisineFilterChips } from "@/components/shared/CuisineFilterChips";
import { CITY_OPTIONS, CUISINE_FILTERS } from "@/data/mockRestaurants";

export function HeroSearch() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>(CITY_OPTIONS[0]);
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  const [price, setPrice] = useState("");

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (city !== CITY_OPTIONS[0]) params.set("city", city);
    if (activeCuisine) params.set("cuisine", activeCuisine);
    if (price) params.set("price", price);

    navigate(`/restaurants?${params.toString()}`);
  }, [query, city, activeCuisine, price, navigate]);

  const handleCuisineSelect = useCallback((cuisine: string) => {
    setActiveCuisine((current) =>
      current === cuisine ? null : cuisine
    );
  }, []);

  return (
    <section
      className="
        relative overflow-hidden
        bg-cover bg-center
        text-background
      "
      style={{
        backgroundImage:
          "url('/images/searchBackground.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/70" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">

        <span
          className="
            inline-flex items-center gap-1.5
            rounded-full
            bg-background/10
            px-3 py-1
            text-sm
            text-background/90
          "
        >
          ✨ Trusted by diners worldwide
        </span>

        <h1 className="mt-6 max-w-2xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Find your next{" "}
          <span className="text-primary">
            favorite place.
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-lg text-background/80">
          Discover restaurants, explore menus, and find the perfect place for your next meal.
        </p>


        {/* Search Box */}
        <div
          className="
            mt-8 flex max-w-5xl
            flex-col gap-3
            rounded-xl
            bg-background
            p-2
            shadow-xl
            ring-1 ring-border
            sm:flex-row
          "
        >

          <div className="flex flex-1 items-center gap-2 px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearch()
              }
              placeholder="Search cuisine, dish, or restaurant"
              className="
                  h-12
                  border-0
                  p-0
                  text-base
                  text-foreground
                  shadow-none
                  focus-visible:ring-0
                "
            />
          </div>


          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-12 w-full border-0 text-base text-foreground sm:w-44">              <SelectValue placeholder="City" />
            </SelectTrigger>

            <SelectContent>
              {CITY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger className="h-12 w-full border-0 text-base text-foreground sm:w-32">              <SelectValue placeholder="Price" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="$">$</SelectItem>
              <SelectItem value="$$">$$</SelectItem>
              <SelectItem value="$$$">$$$</SelectItem>
              <SelectItem value="$$$$">$$$$</SelectItem>
            </SelectContent>
          </Select>


          <Button
            onClick={handleSearch}
            size="lg"
            className="h-12 px-8"
          >
            Search
          </Button>

        </div>


        <div className="mt-4">
          <CuisineFilterChips
            cuisines={CUISINE_FILTERS}
            activeCuisine={activeCuisine}
            onSelect={handleCuisineSelect}
          />
        </div>

      </div>
    </section>
  );
}