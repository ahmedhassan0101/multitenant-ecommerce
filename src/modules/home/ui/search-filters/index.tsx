"use client";
import { useSuspenseQuery } from "@tanstack/react-query";

import Categories from "./Categories";
import SearchInput from "./SearchInput";
import { useTRPC } from "@/trpc/client";
import { useParams } from "next/navigation";
import BreadcrumbNavigation from "./breadcrumbs-navigation";
import { Category } from "@/payload-types";

export default function SearchFilters() {
  const trpc = useTRPC();
  const {
    data: { docs: categories },
  } = useSuspenseQuery(trpc.categories.getAll.queryOptions());
  const params = useParams();

  const activeCategory = (params?.category as string | undefined) ?? "all";

  const matchedCategory = categories.find((cat) => cat.slug === activeCategory);
  const activeCategoryColor = matchedCategory?.color ?? "#f5f5f5";
  const activeCategoryName = matchedCategory?.name ?? null;

  const activeSubcategory = params?.subcategory as string | undefined;
  const activeSubcategoryName =
    matchedCategory?.subcategories?.docs
      ?.filter((sub): sub is Category => typeof sub !== "string")
      .find((sub) => sub.slug === activeSubcategory)?.name ?? null;
  return (
    <div
      className="flex w-full flex-col gap-4 border-b px-4 py-8 lg:px-12"
      style={{ backgroundColor: activeCategoryColor }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories categories={categories} />
      </div>
      <BreadcrumbNavigation
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
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
