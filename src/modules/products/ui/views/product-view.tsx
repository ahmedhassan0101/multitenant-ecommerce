/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { StarRating } from "@/components/global/star-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, LinkIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";
import dynamic from "next/dynamic";
// import { CartButton } from "../components/cart-button";

const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="flex-1 bg-pink-400">
        Add to card
      </Button>
    ),
  }
);

type ProductViewProps = {
  productId: string;
  tenantSlug: string;
};

export default function ProductView({
  productId,
  tenantSlug,
}: ProductViewProps) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );

  return (
    <div className="px-4 lg:px-12 py-10">
      {/* Product container with border and background */}
      <div className="border rounded-sm bg-white overflow-hidden">
        {/* Image section - product cover image */}
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={data.image?.url || "/placeholder.png"}
            alt={data.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Grid layout for product content and side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-6">
          {/* Left - Main product details */}
          <div className="col-span-4">
            {/* Product name */}
            <div className="p-6">
              <h1 className="text-4xl font-medium">{data.name}</h1>
            </div>

            {/* Price + Seller + Desktop rating row */}
            <div className="border-y flex">
              {/* Price tag */}
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className="px-2 py-1 border bg-pink-400 w-fit">
                  <p className="text-base font-medium">
                    {formatCurrency(data.price)}
                  </p>
                </div>
              </div>

              {/* Tenant/seller info */}
              <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                <Link
                  href={generateTenantURL(tenantSlug)}
                  className="flex items-center gap-2"
                >
                  {data.tenant?.image?.url && (
                    <Image
                      src={data.tenant.image.url}
                      alt={data.tenant.name}
                      width={20}
                      height={20}
                      className="rounded-full border shrink-0 size-[20px]"
                    />
                  )}

                  <p className="text-base underline font-medium">
                    {data.tenant?.name}
                  </p>
                </Link>
              </div>
              {/* Rating for desktop */}
              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <div className="flex items-center gap-2">
                  <StarRating rating={2} iconClassName="size-4" />
                  {/* <StarRating
                    rating={data.reviewRating}
                    iconClassName="size-4"
                  /> */}

                  <p className="text-base font-medium">
                    data.reviewCount ratings
                  </p>
                </div>
              </div>
            </div>

            {/* Rating for mobile */}
            <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
              <div className="flex items-center gap-2">
                {/* <StarRating rating={data.reviewRating} iconClassName="size-4" /> */}
                <StarRating rating={3} iconClassName="size-4" />

                <p className="text-base font-medium">
                  data.reviewCount ratings
                </p>
              </div>
            </div>

            {/* Product description */}
            <div className="p-6">
              {data.description ? (
                // <RichText data={data.description} />
                <p className="font-medium text-muted-foreground italic">
                  {data.description}
                </p>
              ) : (
                <p className="font-medium text-muted-foreground italic">
                  No description provided
                </p>
              )}
            </div>
          </div>

          {/* Right - Purchase panel + ratings summary */}
          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full">
              {/* Add to cart section */}
              <div className="flex flex-col gap-4 p-6 border-b">
                {/* Cart and share action buttons */}
                <div className="flex flex-row items-center gap-2">
                  <CartButton
                    // isPurchased={data.isPurchased}
                    tenantSlug={tenantSlug}
                    productId={productId}
                  />
                  <Button
                    variant={"elevated"}
                    className="size-12"
                    onClick={() => {
                      // setIsCopied(true);
                      navigator.clipboard.writeText(window.location.href);
                      // toast.success("Link copied to clipboard");
                      // setTimeout(() => {
                      //   setIsCopied(false);
                      // }, 1000);
                    }}
                    // disabled={isCopied}
                  >
                    <CheckIcon />
                    {/* {isCopied ? <CheckIcon /> : <LinkIcon />} */}
                  </Button>
                </div>

                {/* Refund policy display */}
                <p className="text-center font-medium">
                  {data.refundPolicy === "no-refunds"
                    ? "No refunds"
                    : `${data.refundPolicy} money back guarantee`}
                </p>
              </div>

              {/* Ratings breakdown */}
              <div className="p-6">
                {/* Header with total ratings */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Ratings</h3>

                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />

                    {/* <p>{data.reviewRating}</p> */}
                    <p>(3)</p>

                    {/* <p className="text-base">{data.reviewCount} ratings</p> */}
                    <p className="text-base">20 ratings</p>
                  </div>
                </div>

                {/* Ratings progress bars */}
                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <Fragment key={stars}>
                      <div className="font-medium">
                        {stars} {stars === 1 ? "star" : "stars"}
                      </div>

                      <Progress
                        value={stars * 20}
                        // value={data.ratingDistribution[stars]}
                        className="h-[1lh]"
                      />

                      <div className="font-medium">
                        {stars * 20}%{/* {data.ratingDistribution[stars]}% */}
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ProductViewSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9]">
          <Image
            src={"/placeholder.png"}
            alt={"Placeholder"}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};
