// src/app/tenants/[slug]/library/ProductItem.tsx
import Image from "next/image";
import React from "react";

import { Media, Product, Tenant } from "@/payload-types";
const ProductItem = ({ product }: { product: Product }) => {
  const image = product.image as Media;
  const tenant = product.tenant as Tenant;
  return (
    <div className="flex items-center gap-4 p-4 border rounded-md bg-gray-50">
      <div className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden">
        {image && (
          <Image
            src={image?.url ?? ""}
            alt={image.alt || product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        )}
        {/* {product.image && typeof product.image !== "string" && (
          <Image
            src={product.image.url}
            alt={product.image.alt || product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        )} */}
      </div>

      <div className="flex-1">
        <h4 className="font-medium text-base text-gray-900">{product.name}</h4>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        <p className="text-sm font-bold text-green-600 mt-1">
          {product.price} EGP
        </p>
      </div>

      <div className="hidden sm:block text-right">
        <p className="text-xs text-gray-400">Sold by:</p>
        {/* {typeof product.tenant !== "string" && ( */}
        <p className="text-sm font-semibold text-gray-700">{tenant.name}</p>
        {/* )} */}
      </div>
    </div>
  );
};

export default ProductItem;
