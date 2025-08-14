/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { AlertCircleIcon, PackageIcon } from "lucide-react";
import OrderCard from "./order-card";
import Link from "next/link";

export default function OrdersList() {
  const trpc = useTRPC();

  const {
    data: ordersData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    error,
  } = useSuspenseInfiniteQuery(
    trpc.library.getAll.infiniteQueryOptions(
      {},
      {
        getNextPageParam: (lastPage) => {
          return lastPage.hasNextPage ? lastPage.nextPage : undefined;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
      }
    )
  );

  const allOrders = ordersData.pages.flatMap((page) => page.docs);
  const totalOrders = ordersData.pages[0]?.totalDocs || 0;

  if (error) {
    return <OrdersError error={error} />;
  }

  if (allOrders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="divide-y divide-gray-100">
      {/* Results Summary */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <p className="text-sm text-gray-600">
          Showing {allOrders.length} of {totalOrders} orders
          {/* {filters.status && filters.status !== 'all' && ( */}
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            filters.status
          </span>
          {/* )} */}
        </p>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-gray-100">
        {allOrders.map((order, index) => (
          <Fragment key={order.id || index}>
            <OrderCard order={order} />
          </Fragment>
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="px-6 py-8 text-center border-t border-gray-100">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            {isFetchingNextPage ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                Loading more...
              </>
            ) : (
              <>
                <PackageIcon className="w-4 h-4 mr-2" />
                Load More Orders
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export function OrdersListSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="p-6 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-5 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-48 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-36"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, productIndex) => (
                <div key={productIndex} className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersError({ error }: { error: any }) {
  return (
    <div className="p-8 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
        <AlertCircleIcon className="w-6 h-6 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to load orders
      </h3>
      <p className="text-gray-600 mb-4">
        {error.message || "Something went wrong while fetching your orders."}
      </p>
      <Button onClick={() => window.location.reload()} variant="outline">
        Try Again
      </Button>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="p-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
        <PackageIcon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No orders found
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        You haven&apos;t made any purchases yet. Start shopping to see your
        orders here.
      </p>
      <Button asChild>
        <Link href="/">Start Shopping</Link>
      </Button>
    </div>
  );
}
