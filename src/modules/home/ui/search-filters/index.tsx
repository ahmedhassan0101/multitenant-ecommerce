"use client";
import { useSuspenseQuery } from "@tanstack/react-query";

import Categories from "./Categories";
import SearchInput from "./SearchInput";
import { useTRPC } from "@/trpc/client";

export default function SearchFilters() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getAll.queryOptions());
  return (
    <div className="flex w-full flex-col gap-4 border-b px-4 py-8 lg:px-12">
      <SearchInput />
      <div className="hidden lg:block">
        <Categories categories={data.docs} />
      </div>
    </div>
  );
}

export const SearchFiltersSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4 border-b bg-[#f5f5f5] px-4 py-8 lg:px-12">
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
