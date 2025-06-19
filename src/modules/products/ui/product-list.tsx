"use client";
import { Product } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { useProductFilters } from "../use-product-filters";

interface Props {
  categorySlug: string;
  isSubcategory?: boolean;
}

export default function ProductList({
  categorySlug,
  isSubcategory = false,
}: Props) {
  const [filters] = useProductFilters();

  const trpc = useTRPC();
  const products = useSuspenseQuery(
    trpc.products.getAll.queryOptions({
      categorySlug,
      isSubcategory,
      ...filters,
    })
  );
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.data?.map((product: Product) => (
          <div key={product.id} className="border p-4 rounded bg-white">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-semibold">${product.price}</p>
            <p className="text-sm text-gray-500">
              Category:
              <b className="text-red-500">
                {typeof product.category === "object" && product.category?.name}
              </b>
            </p>
            {product.tags?.length ? (
              <div className="flex gap-1 text-gray-500">
                Tags:
                {product.tags.map((t) =>
                  typeof t === "object" && t !== null ? (
                    <b
                      key={t.id}
                      className="bg-gray-300 text-sm text-black rounded-sm  px-1"
                    >
                      {t.name}
                    </b>
                  ) : null
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

export const ProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border p-4 rounded animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};
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
