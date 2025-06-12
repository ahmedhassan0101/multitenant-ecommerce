// src\app\(app)\(home)\[category]\page.tsx
import ProductList, {
  ProductListSkeleton,
} from "@/modules/products/ui/product-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  // const product = await caller.products.getAll();
  const queryClient = getQueryClient();
  try {
    // Prefetch products for this parent category (includes subcategories)
    void queryClient.prefetchQuery(
      trpc.products.getAll.queryOptions({
        categorySlug: category,
        isSubcategory: false, // This is a parent category
      })
    );
  } catch (error) {
    console.error("Error prefetching category data:", error);
    // notFound();
  }
  return (
    <>
      <h1>Welcome to Category page!</h1>
      <h1>Category: {category}</h1>
      <pre>{/* <code>{JSON.stringify(product.docs, null, 2)}</code> */}</pre>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList categorySlug={category} isSubcategory={false} />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
