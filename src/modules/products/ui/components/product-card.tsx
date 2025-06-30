import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type ProductCardProps = {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string; // Slug of the product's associated tenant
  tenantImageUrl?: string | null; // Optional image URL of the tenant/creator
  reviewRating: number;
  reviewCount: number;
  price: number;
};

export default function ProductCard({
  id,
  name,
  imageUrl,
  tenantSlug,
  tenantImageUrl,
  reviewRating,
  reviewCount,
  price,
}: ProductCardProps) {
  const router = useRouter(); // Initialize Next.js router for programmatic navigation

  const handleUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(generateTenantURL(tenantSlug)); // Navigate to the tenant's store page
  };
  return (
    <Link href={`/products/${id}`}>
      {/* <Link href={`${generateTenantURL(tenantSlug)}/products/${id}`}> */}
      <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden h-full flex flex-col">
        <div className="relative aspect-square">
          <Image
            alt={name}
            fill
            src={imageUrl || "/placeholder.png"} // Fallback to placeholder if no image provided
            className="object-cover"
          />
        </div>

        <div className="p-4 border-y flex flex-col gap-3 flex-1">
          <h2 className="text-lg font-medium line-clamp-4">{name}</h2>

          {/* click navigates to tenant's store */}
          <div className="flex items-center gap-2" onClick={handleUserClick}>
            {tenantImageUrl && (
              <Image
                alt={tenantSlug}
                src={tenantImageUrl}
                width={16}
                height={16}
                className="rounded-full border shrink-0 size-[16px]"
              />
            )}
            <p className="text-sm underline font-medium">{tenantSlug}</p>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-3.5 fill-black" />
              <p className="text-sm font-medium">
                {reviewRating} ({reviewCount})
              </p>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="relative px-2 py-1 border bg-pink-400 w-fit">
            <p className="text-sm font-medium">{formatCurrency(price)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
