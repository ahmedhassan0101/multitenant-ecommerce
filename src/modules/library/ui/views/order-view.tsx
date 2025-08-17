"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  Calendar,
  User,
  Store,
  CreditCard,
  Package,
  CheckCircle,
  Download,
  ArrowLeftIcon,
} from "lucide-react";
import Link from "next/link";
import ProductCard from "../components/order-view/product-card";
import Footer from "@/modules/home/ui/Footer";

interface OrderViewProps {
  orderId: string;
}

export default function OrderView({ orderId }: OrderViewProps) {
  const trpc = useTRPC();

  const { data: order } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      orderId,
    })
  );
  // Extract product IDs for reviews
  const productIds = order.products.map((product) => product.id);

  const { data: reviewsMap } = useSuspenseQuery(
    trpc.reviews.getMultiple.queryOptions({
      productIds,
    })
  );

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedAmount = (order.totalAmount / 100).toFixed(2);

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
          Order not found
        </h2>
        <p className="text-gray-500 mt-2">
          The order you&apos;re looking for doesn&apos;t exist or you don&apos;t
          have permission to view it.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* */}
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="font-medium">Back to Orders</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Order Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Order ID: <span className="font-mono text-sm">{order.id}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          </div>
        </div>

        {/* Order Summary Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Order Date */}
              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* Total Amount */}
              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <CreditCard className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Paid
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    ${formattedAmount}
                  </p>
                </div>
              </div>

              {/* Products Count */}
              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Package className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {order.products.length} Product{order.products.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Payment ID */}
              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </p>
                  <p className="text-xs font-mono text-gray-700 dark:text-gray-300 truncate">
                    {order.stripeCheckoutSessionId?.slice(-16) || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer & Seller Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Customer Information</span>
                </h4>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span>{" "}
                    {order.user.username || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span>{" "}
                    {order.user?.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* Seller Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <Store className="w-4 h-4" />
                  <span>Seller Information</span>
                </h4>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm space-y-3">
                  <div className="flex items-center space-x-3">
                    {order.tenant.image?.url && (
                      <Image
                        src={order.tenant.image?.url ?? ""}
                        alt={order.tenant.image.alt || order.tenant.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {order.tenant?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{order.tenant?.slug || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Products ({order.products.length})
            </h2>
          </div>

          {order.products.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {order.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  initialReview={reviewsMap[product.id] || null}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  No products found
                </h3>
                <p className="text-gray-500 mt-2">
                  This order doesn&apos;t contain any products.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Invoice</span>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/support">Contact Support</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export function OrderViewSkeleton() {
  return (
    <div className="space-y-6 container mx-auto">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
