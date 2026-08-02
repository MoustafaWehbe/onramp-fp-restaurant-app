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

export const MOCK_FEATURED_RESTAURANTS: Restaurant[] = [
  {
    id: "r1",
    slug: "ember-and-table",
    name: "Ember & Table",
    cuisine: "Mediterranean",
    city: "New York",
    address: "12 Vine St, SoHo",
    priceLevel: 3,
    rating: 4.8,
    reviewCount: 1284,
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "r2",
    slug: "osteria-mira",
    name: "Osteria Mira",
    cuisine: "Italian",
    city: "San Francisco",
    address: "88 Hayes St",
    priceLevel: 3,
    rating: 4.7,
    reviewCount: 942,
    imageUrl:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "r3",
    slug: "kaiseki-noru",
    name: "Kaiseki Noru",
    cuisine: "Japanese",
    city: "Chicago",
    address: "401 W Loop",
    priceLevel: 4,
    rating: 4.9,
    reviewCount: 612,
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "r4",
    slug: "the-burger-yard",
    name: "The Burger Yard",
    cuisine: "American",
    city: "Austin",
    address: "220 S Congress",
    priceLevel: 2,
    rating: 4.5,
    reviewCount: 2031,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "r5",
    slug: "casa-verde",
    name: "Casa Verde",
    cuisine: "Mexican",
    city: "Los Angeles",
    address: "77 Sunset Blvd",
    priceLevel: 2,
    rating: 4.6,
    reviewCount: 1508,
    imageUrl:
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "r6",
    slug: "le-jardin",
    name: "Le Jardin",
    cuisine: "French",
    city: "Boston",
    address: "9 Beacon Hill",
    priceLevel: 4,
    rating: 4.9,
    reviewCount: 731,
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
  },
];

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