import { loadProductFilters } from "@/modules/products/search-params";
import ProductListView from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";

interface HomeProps {
  searchParams: Promise<SearchParams>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const filters = await loadProductFilters(searchParams);
  const queryClient = getQueryClient();
  try {
    // Prefetch products for this parent category (includes subcategories)
    void queryClient.prefetchQuery(
      trpc.products.getAll.queryOptions({
        ...filters,
        // limit: DEFAULT_LIMIT, // Use default pagination limit
      })
    );
  } catch (error) {
    console.error("Error prefetching category data:", error);
    // notFound();
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  );
}

// export default async function HomePage() {
//   // const tags = await caller.tags.getAll();
//   const products = await caller.products.getAll({});

//   // const trpc = useTRPC();
//   // const session = useQuery(trpc.auth.session.queryOptions());
//   return (
//     <pre>
//       {/* <code>{JSON.stringify(tags.docs, null, 3)}</code> */}
//       <code>{JSON.stringify(products, null, 3)}</code>
//     </pre>
//   );
// }

// TODO: Server component approach
// import { getQueryClient, trpc } from "@/trpc/server";

// export default async function HomePage() {
//   const queryClient = getQueryClient();
//   const categories = await queryClient.fetchQuery(
//     trpc.categories.getAll.queryOptions()
//   );

//   return <h1>{JSON.stringify(categories, null, 2)}</h1>;
// }

// !--------------------------------------------
// TODO: Client component approach.
// "use client"
// import { useQuery } from "@tanstack/react-query";
// import { useTRPC } from "@/trpc/client";

// export default  function HomePage() {
//   const trpc = useTRPC();
//   const categories = useQuery(trpc.categories.getAll.queryOptions());
//   if (!categories.data) return <div>Loading...</div>;

//   return <h1>{JSON.stringify(categories, null, 2)}</h1>;
// }
