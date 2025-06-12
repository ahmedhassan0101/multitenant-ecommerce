import ProductList, {
  ProductListSkeleton,
} from "@/modules/products/ui/product-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

// src\app\(app)\(home)\[category]\[subcategory]\page.tsx
interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default async function SubCategoryPage({ params }: Props) {
  const { category, subcategory } = await params;
  const queryClient = getQueryClient();

  try {
    // Prefetch products for this specific subcategory only
    void queryClient.prefetchQuery(
      trpc.products.getAll.queryOptions({
        categorySlug: subcategory, // Use subcategory slug
        isSubcategory: true, // This is a subcategory
      })
    );
  } catch (error) {
    console.error("Error prefetching subcategory data:", error);
    // notFound();
  }

  return (
    <>
      <h1>Welcome to SubCategory page!</h1>
      <h1>Category: {category} </h1>
      <h1>SubCategory: {subcategory}</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList categorySlug={subcategory} isSubcategory={true} />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
