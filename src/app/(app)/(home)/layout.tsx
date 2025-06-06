import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import SearchFilters, { SearchFiltersSkeleton } from "@/modules/home/ui/search-filters";
import Navbar from "@/modules/home/ui/Navbar";
import Footer from "@/modules/home/ui/Footer";
import { Suspense } from "react";


//  prefetchQuery approach
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getAll.queryOptions());

  return (
    <section className="flex min-h-screen flex-col">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFiltersSkeleton/>}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </section>
  );
}

// let data = null;
//   let error = null;

//   try {
//     const response = await fetch("http://localhost:3000/my-route", {
//       cache: "no-store",
//     });
//     if (!response.ok) throw new Error("Error");
//     data = await response.json();
//   } catch (err) {
//     error = err instanceof Error ? err.message : "خطأ غير معروف";
//     console.log(error);
//   }
// Because of depth 1, we are confident doc will be a type of Category
// const formattedData = data.docs.map((doc: Category) => ({
//   ...doc,
//   subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
//     ...(doc as Category),
//   })),
// }));
// console.log("data: 50 50" + JSON.stringify(data, null, 2));

