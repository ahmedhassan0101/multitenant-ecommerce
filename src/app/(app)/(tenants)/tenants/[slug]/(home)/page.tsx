import React from "react";

import { SearchParams } from "nuqs/server";
import { loadProductFilters } from "@/modules/products/search-params";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProductListView from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";

type Props = {
  params: Promise<{ slug: string }>; // Dynamic segment from the route (tenant slug)
  searchParams: Promise<SearchParams>; // URL query params (minPrice, maxPrice, tags, etc.)
};

export default async function page({ params, searchParams }: Props) {
  const { slug } = await params; // Extract tenant slug from dynamic route
  const filters = await loadProductFilters(searchParams); // Parse filter values from URL params (price range, tags, etc.)

  const queryClient = getQueryClient(); // Initialize the React Query client for SSR

  try {
    // Prefetch products for this parent category (includes subcategories)
    void queryClient.prefetchQuery(
      trpc.products.getAll.queryOptions({
        ...filters,
        tenantSlug: slug, // Filter products by the tenant’s unique slug
        // page: parseInt(resolvedSearchParams?.page || "1"),
        // limit: 6,
      })
    );
  } catch (error) {
    console.error("Error prefetching category data:", error);
    // notFound();
  }
  return (
    // HydrationBoundary - Wraps the pre-fetched data to hydrate the client side
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} />
    </HydrationBoundary>
  );
}
