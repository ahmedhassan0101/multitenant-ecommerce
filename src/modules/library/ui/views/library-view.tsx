import {
  ArrowLeftIcon,
  PackageIcon,
  TrendingUpIcon,
  ShoppingBagIcon,
  ClockIcon,
} from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import OrdersStats from "../components/library-view/orders-stats";
import OrdersList, {
  OrdersListSkeleton,
} from "../components/library-view/orders-list";
import OrdersFilters from "../components/library-view/orders-filters";
import Footer from "@/modules/home/ui/Footer";

export default function LibraryView() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="font-medium">Continue Shopping</span>
            </Link>

            <div className="flex items-center gap-2 text-gray-500">
              <PackageIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Order History</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your Library
              </h1>
              <p className="text-lg text-gray-600">
                Track your purchases and order history
              </p>
            </div>

            {/* Quick Stats Preview */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <ShoppingBagIcon className="w-4 h-4" />
                <span>All Orders</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUpIcon className="w-4 h-4" />
                <span>Total Spent</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Statistics Cards */}
            <div className="mb-8">
              <OrdersStats />
            </div>

            {/* Filters */}
            <div className="mb-6">
              <OrdersFilters />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" />
                  Recent Orders
                </h2>
                <p className="text-gray-600 mt-1">
                  Your recent purchases and their current status
                </p>
              </div>
              <Suspense fallback={<OrdersListSkeleton />}>
                <OrdersList />
              </Suspense>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <Link
                  href="/support"
                  className="block w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="font-medium text-gray-900">
                    Contact Support
                  </div>
                  <div className="text-sm text-gray-500">
                    Need help with an order?
                  </div>
                </Link>

                <Link
                  href="/returns"
                  className="block w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="font-medium text-gray-900">
                    Returns & Refunds
                  </div>
                  <div className="text-sm text-gray-500">
                    Manage your returns
                  </div>
                </Link>

                <Link
                  href="/account"
                  className="block w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="font-medium text-gray-900">
                    Account Settings
                  </div>
                  <div className="text-sm text-gray-500">
                    Update your preferences
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
