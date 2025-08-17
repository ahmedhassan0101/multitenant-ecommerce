// src/modules/library/ui/components/order-view-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OrderViewSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Skeleton className="h-6 w-32" />
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>

        {/* Order Summary Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Skeleton className="w-5 h-5 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>

            {/* Customer & Seller Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  
                  {/* Review Form Skeleton */}
                  <Card className="mt-6">
                    <CardHeader>
                      <Skeleton className="h-5 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Skeleton key={starIndex} className="w-8 h-8 rounded" />
                        ))}
                      </div>
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}