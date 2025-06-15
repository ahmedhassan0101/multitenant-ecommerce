// src\app\(app)\(home)\[category]\page.tsx
import CustomAccordion from "@/modules/products/ui/product-filters";
import ProductList, {
  ProductListSkeleton,
} from "@/modules/products/ui/product-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { loadProductFilters } from "@/modules/products/search-params";
interface Props {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();

  try {
    // Prefetch products for this parent category (includes subcategories)
    void queryClient.prefetchQuery(
      trpc.products.getAll.queryOptions({
        categorySlug: category,
        isSubcategory: false, // This is a parent category
        ...filters,
      })
    );
  } catch (error) {
    console.error("Error prefetching category data:", error);
    // notFound();
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4 px-4 py-8 lg:px-12">
        <div className="flex flex-col justify-between gap-y-2 lg:flex-row lg:items-center lg:gap-y-0 border">
          <p className="text-2xl font-medium">Curated for you</p>
          <div className="flex items-center gap-2 uppercase">
            <p>Curated</p>
            <p>Trending</p>
            <p>Hot & New</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-6 xl:grid-cols-8">
          <div className="lg:col-span-2 xl:col-span-2 ">
            <CustomAccordion />
          </div>

          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList categorySlug={category}  isSubcategory={false}/>
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
  