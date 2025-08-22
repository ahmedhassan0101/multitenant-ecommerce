// import { DEFAULT_LIMIT } from "@/lib/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import ProductListView from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
export const dynamic = "force-dynamic";
interface Props {
  params: Promise<{
    subcategory: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export default async function SubCategoryPage({ params, searchParams }: Props) {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();

  try {
    // Prefetch products for this specific subcategory only
    void queryClient.prefetchQuery(
      trpc.products.getAll.queryOptions({
        categorySlug: subcategory, // Use subcategory slug
        isSubcategory: true, // This is a subcategory
        ...filters,
        // limit: DEFAULT_LIMIT, // Use default pagination limit
      })
    );
  } catch (error) {
    console.error("Error prefetching subcategory data:", error);
    // notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView categorySlug={subcategory} isSubcategory={true} />
    </HydrationBoundary>
  );
}


{
  /* 
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList categorySlug={subcategory} isSubcategory={true} />
    </Suspense> 
  */
}
