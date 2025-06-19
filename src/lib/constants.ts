export const DEFAULT_LIMIT = 6;
export const DEFAULT_PAGE = 1;
export const DEFAULT_CURSOR = 1;
export const DEFAULT_BG_COLOR = "#f5f5f5";

export const sortValues = [
  "curated",
  "trending",
  "hot_and_new",
  "price_asc",
  "price_desc",
] as const;
export const sortOptions = [
  { label: "Curated", value: "curated" },
  { label: "Trending", value: "trending" },
  { label: "Hot & New", value: "hot_and_new" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
] as const;
