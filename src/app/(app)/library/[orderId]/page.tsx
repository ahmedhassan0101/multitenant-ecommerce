/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\(app)\library\[orderId]\page.tsx
import OrderViewSkeleton from "@/modules/library/ui/components/order-view-skeleton";
import OrderView from "@/modules/library/ui/views/order-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

type Props = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function page({ params }: Props) {
  const { orderId } = await params;

  if (!orderId || orderId.trim().length === 0) {
    notFound();
  }
  const queryClient = getQueryClient();

  try {
    // First, prefetch the order data
    await queryClient.prefetchQuery(
      trpc.library.getOne.queryOptions({
        orderId,
      })
    );

    // Get the order data to extract product IDs for reviews prefetching
    const orderData = await queryClient.fetchQuery(
      trpc.library.getOne.queryOptions({
        orderId,
      })
    );

    // Extract product IDs from the order
    const productIds =
      orderData?.products?.map((product: any) =>
        typeof product === "string" ? product : product.id
      ) || [];

    // Prefetch reviews for all products at once
    if (productIds.length > 0) {
      await queryClient.prefetchQuery(
        trpc.reviews.getMultiple.queryOptions({
          productIds,
        })
      );
    }
  } catch (error) {
    console.error("Error prefetching order data:", error);
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<OrderViewSkeleton />}>
        <OrderView orderId={orderId} />
      </Suspense>
    </HydrationBoundary>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;

  return {
    title: `Order Details - ${orderId.slice(-8)}`,
    description: "View your order details and product information",
  };
}
