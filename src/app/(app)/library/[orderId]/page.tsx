// src\app\(app)\library\[orderId]\page.tsx
import OrderView, { OrderViewSkeleton } from "@/modules/library/ui/views/order-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import React, { Suspense } from "react";

type Props = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function page({ params }: Props) {
  const { orderId } = await params;

  // if (!orderId || orderId.trim().length === 0) {
  //   notFound();
  // }
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({
      orderId,
    })
  );

  // try {
  //   // Prefetch the order data
  //   await queryClient.prefetchQuery(
  //     trpc.library.getOne.queryOptions({
  //       orderId,
  //     })
  //   );
  // } catch (error) {
  //   console.error('Error prefetching order:', error);
  //   notFound();
  // }

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
