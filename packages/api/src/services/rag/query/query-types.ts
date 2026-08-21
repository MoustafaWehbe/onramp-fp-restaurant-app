export const RETRIEVAL_TYPES = {
  DATABASE: "database",
  SEMANTIC: "semantic",
  HYBRID: "hybrid",
} as const;

export type RetrievalType =
  (typeof RETRIEVAL_TYPES)[keyof typeof RETRIEVAL_TYPES];

export const QUERY_ANALYSIS_STATUS = {
  RELEVANT: "relevant",
  IRRELEVANT: "irrelevant",
} as const;

export type QueryAnalysisStatus =
  (typeof QUERY_ANALYSIS_STATUS)[keyof typeof QUERY_ANALYSIS_STATUS];

export const PRICE_RANGES = {
  BUDGET: "Budget",
  AVERAGE: "Average",
  EXPENSIVE: "Expensive",
  LUXURY: "Luxury",
} as const;

export type PriceRange =
  (typeof PRICE_RANGES)[keyof typeof PRICE_RANGES];

export interface RetrievalFilters {
  // Restaurant / branch
  city?: string;
  cuisine?: string;
  price?: PriceRange;
  minRating?: number;
  maxRating?: number;
  isOpenNow?: boolean;

  // Menu
  menuName?: string;
  menuDescription?: string;

  // Menu item
  menuItemName?: string;
  menuItemDescription?: string;
  minItemPrice?: number;
  maxItemPrice?: number;
}

export interface RetrievalPlan {
  status: QueryAnalysisStatus;
  query: string;
  retrievalType?: RetrievalType;
  filters?: RetrievalFilters;
  semanticQuery?: string;
}