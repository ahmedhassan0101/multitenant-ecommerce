"use client";
import { Product } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { useProductFilters } from "../../use-product-filters";
import ProductCard from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationComponent from "@/components/global/pagination-component";
interface Props {
  categorySlug?: string;
  isSubcategory?: boolean;
}

export default function ProductList({
  categorySlug,
  isSubcategory = false,
}: Props) {
  const [filters, setFilters] = useProductFilters();

  const trpc = useTRPC();
  const {
    data: { products, pagination },
  } = useSuspenseQuery(
    trpc.products.getAll.queryOptions({
      categorySlug,
      isSubcategory,
      ...filters,
    })
  );
  const handlePageChange = (page: number) => {
    setFilters({ page });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product: Product) => {
          const media = product.image;
          const imageUrl =
            typeof media === "object" && media !== null && "url" in media
              ? media.url
              : undefined;
          return (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={imageUrl}
              tenantSlug="Ahmed"
              tenantImageUrl={undefined}
              reviewRating={3}
              reviewCount={5}
              price={product.price}
            />
          );
        })}
      </div>
      {/* Pagination Component */}
      {pagination && (
        <PaginationComponent
          currentPage={pagination.page!}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={pagination.totalDocs}
          itemsPerPage={pagination.limit}
        />
      )}
    </>
  );
}

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="border rounded-md bg-white overflow-hidden flex flex-col"
        >
          <Skeleton className="aspect-square w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" /> {/* اسم المنتج */}
            <Skeleton className="h-3 w-1/2" /> {/* اسم التاجر */}
            <Skeleton className="h-3 w-1/3" /> {/* التقييم */}
          </div>
          <div className="p-4">
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

{
  /* <pre>
        <code>{JSON.stringify(product.data.docs, null, 2)}</code>
      </pre> */
}
{
  /* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {product?.data?.docs.map((product) => (
          <div key={product.id} className="p-4 bg-white border rounded-md">
            <h2 className="text-xl font-medium">{product.name}</h2>
            <p>${product.price}</p>
          </div>
        ))}
      </div> */
}
// <div key={product.id} className="border p-4 rounded bg-white">
//   <h3 className="font-bold">{product.name}</h3>
//   <p className="text-gray-600">{product.description}</p>
//   <p className="text-lg font-semibold">${product.price}</p>
//   <p className="text-sm text-gray-500">
//     Category:
//     <b className="text-red-500">
//       {typeof product.category === "object" && product.category?.name}
//     </b>
//   </p>
//   {product.tags?.length ? (
//     <div className="flex gap-1 text-gray-500">
//       Tags:
//       {product.tags.map((t) =>
//         typeof t === "object" && t !== null ? (
//           <b
//             key={t.id}
//             className="bg-gray-300 text-sm text-black rounded-sm  px-1"
//           >
//             {t.name}
//           </b>
//         ) : null
//       )}
//     </div>
//   ) : null}
// </div>
