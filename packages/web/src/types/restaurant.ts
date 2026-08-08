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

export interface ReviewUser {
  id: string;
  name: string;
}

export interface BranchReview {
  id: string;
  userId: string;
  branchId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: ReviewUser;
}

export interface Branch {
  id: string;
  restaurantId: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  opening_hours: string;
  reviews: BranchReview[];
}

export interface MenuSummary {
  id: string;
  name: string;
}

export interface RestaurantDetails {
  id: string;
  name: string;
  description: string;
  price_range: string;
  ambiance_tags: string[];
  cuisine_type: string;
  email: string;
  phone: string;
  branches: Branch[];
  menus: MenuSummary[];
}

export interface RestaurantDetailsResponse {
  data: RestaurantDetails;
}