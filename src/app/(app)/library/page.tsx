import LibraryView from "@/modules/library/ui/views/library-view";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
export const dynamic = "force-dynamic";
export default function Page() {
  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery(
    trpc.library.getAll.infiniteQueryOptions({})
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
}
