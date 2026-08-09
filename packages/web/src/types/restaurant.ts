export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string;
  cuisine_type: string;
  price_range: string;
  average_rating: number;
  review_count: number;
  image_url: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RestaurantListResponse {
  data: Restaurant[];
  meta: PaginationMeta;
  message: string;
}

export interface RestaurantSearchParams {
  search?: string;
  city?: string;
  cuisine?: string;
  priceRange?: string;
  page?: number;
  limit?: number;
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
  slug: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  opening_hours: string;
  review_count: number;
  average_rating: string;
  reviews: BranchReview[];
}

export interface MenuSummary {
  id: string;
  name: string;
  description: string;
}

export interface RestaurantDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_range: string;
  ambiance_tags: string[];
  cuisine_type: string;
  email: string;
  phone: string;
  review_count: number;
  average_rating: string;
  image_url: string;
  branches: Branch[];
  menus: MenuSummary[];
}

export interface RestaurantDetailsResponse {
  data: RestaurantDetails;
}