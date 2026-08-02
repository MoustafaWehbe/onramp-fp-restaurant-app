export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  cuisine: string;
  city: string;
  address: string;
  priceLevel: 1 | 2 | 3 | 4; // maps to $ - $$$$
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

export interface SiteStat {
  id: string;
  label: string;
  value: string;
}

export interface HowItWorksStep {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: "search" | "utensils" | "review" | "ai";
}