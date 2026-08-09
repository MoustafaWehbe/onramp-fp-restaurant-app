import type { Restaurant, SiteStat, HowItWorksStep } from "@/types/restaurant";

/**
 * TEMPORARY MOCK DATA
 * -------------------
 * The `/restaurants/featured` and `/stats/summary` endpoints aren't ready yet.
 * This file stands in for those API responses so the landing page can be
 * built and reviewed now. Once the endpoints ship, delete this file and
 * swap the call sites (see FeaturedRestaurants.tsx and StatsBar.tsx) for
 * the real `restaurantsApi.getFeatured()` / `statsApi.getSummary()` calls.
 */


export const MOCK_SITE_STATS: SiteStat[] = [
  { id: "s1", label: "Restaurants", value: "12,400+" },
  { id: "s2", label: "Cities", value: "48" },
  { id: "s3", label: "Menu Items", value: "50,000+" },
  { id: "s4", label: "Avg rating", value: "4.8★" },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: "step-1",
    step: 1,
    title: "Discover",
    description:
      "Search restaurants by cuisine, location, price, vibe, or your personal preferences.",
    icon: "search",
  },
  {
    id: "step-2",
    step: 2,
    title: "Ask AI",
    description:
      "Get personalized restaurant suggestions from our AI assistant based on what you are looking for.",
    icon: "ai",
  },
  {
    id: "step-3",
    step: 3,
    title: "Choose",
    description:
      "Explore menus, photos, branches, and reviews to find the perfect place.",
    icon: "review",
  },
];

export const CUISINE_FILTERS = [
  "Italian",
  "Japanese",
  "American",
  "Mexican",
  "French",
] as const;

export const CITY_OPTIONS = [
  "All cities",
  "New York",
  "San Francisco",
  "Chicago",
  "Austin",
  "Los Angeles",
  "Boston",
] as const;