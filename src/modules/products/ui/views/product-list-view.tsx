import React, { Suspense } from "react";
import ProductSort from "../components/product-sort";
import ProductFilters from "../components/product-filters";
import ProductList, { ProductListSkeleton } from "../components/product-list";

type ProductListViewProps = {
  categorySlug?: string;
  isSubcategory?: boolean;
  tenantSlug?: string;
};

export default function ProductListView({
  categorySlug,
  isSubcategory,
  tenantSlug,
}: ProductListViewProps) {
  return (
    <div className="flex flex-col gap-8 px-4 py-8 lg:px-12">
      <ProductSort />
      <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-6 xl:grid-cols-8">
        <div className="lg:col-span-2 xl:col-span-2 ">
          <ProductFilters />
        </div>
        <div className="lg:col-span-4 xl:col-span-6">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList
              categorySlug={categorySlug}
              isSubcategory={isSubcategory}
              tenantSlug={tenantSlug}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
