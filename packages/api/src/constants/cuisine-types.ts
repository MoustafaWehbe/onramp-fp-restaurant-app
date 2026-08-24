export const CUISINE_TYPES = [
  "Italian",
  "Lebanese",
  "Japanese",
  "Chinese",
  "Indian",
  "Mexican",
  "Thai",
  "Korean",
  "French",
  "International",
  "Mediterranean",
  "Seafood",
  "American",
] as const;

export type CuisineType = (typeof CUISINE_TYPES)[number];