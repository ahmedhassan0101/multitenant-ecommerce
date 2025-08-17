import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatAsCurrency = (value: string): string => {
  if (!value) return "";

  const numericValue = value.replace(/[^0-9.]/g, "");
  const [whole, decimal] = numericValue.split(".");
  const cleanValue = whole + (decimal ? `.${decimal.slice(0, 2)}` : "");

  const numberValue = parseFloat(cleanValue);
  if (isNaN(numberValue)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", // Format output as currency
    currency: "USD", // Use US Dollars
    maximumFractionDigits: 0, // Round to whole number
  }).format(Number(value)); // Convert value to number and apply formatting
}

export function generateTenantURL(tenantSlug: string) {
  return `/tenants/${tenantSlug}`;
}

export const calculateRatingMetrics = (
  reviewsData: Array<{ rating: number }>
) => {
  const totalReviews = reviewsData.length;

  if (totalReviews === 0) {
    return {
      reviewRating: 0,
      reviewCount: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
  // Initialize counters
  let totalRatingSum = 0;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  // Single loop to calculate everything
  reviewsData.forEach((review) => {
    const rating = review.rating;
    totalRatingSum += rating;
    // Count each rating (with validation)
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating as keyof typeof ratingCounts]++;
    }
  });
  // Calculate average rating
  const reviewRating = Number((totalRatingSum / totalReviews).toFixed(1));
  // Convert counts to percentages
  const ratingDistribution = Object.entries(ratingCounts).reduce(
    (acc, [rating, count]) => {
      acc[Number(rating)] = Math.round((count / totalReviews) * 100);
      return acc;
    },
    {} as Record<number, number>
  );

  return {
    reviewRating,
    reviewCount: totalReviews,
    ratingDistribution,
  };
};
