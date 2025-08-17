"use client";

import {
  ShoppingBagIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  TrendingUpIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function OrdersStats() {
  const isLoading = false,
    error = false,
    stats = {
      totalOrders: 5,
      completedOrders: 3,
      pendingOrders: 2,
      totalSpent: 500,
      averageOrderValue: 5,
    };

  if (isLoading) return <OrdersStatsSkeleton />;
  if (error) return <StatsError />;
  if (!stats) return null;

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      description: "All time orders",
      icon: ShoppingBagIcon,
      color: "blue",
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders.toString(),
      description: "Successfully delivered",
      icon: CheckCircleIcon,
      color: "green",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      description: "Being processed",
      icon: ClockIcon,
      color: "yellow",
    },
    {
      title: "Total Spent",
      value: formatCurrency(stats.totalSpent / 100), // Convert from cents
      description: "Lifetime spending",
      icon: DollarSignIcon,
      color: "purple",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      border: "border-green-200",
    },
    yellow: {
      bg: "bg-yellow-50",
      icon: "text-yellow-600",
      border: "border-yellow-200",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      border: "border-purple-200",
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const colors = colorClasses[card.color as keyof typeof colorClasses];
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`
              relative overflow-hidden rounded-lg border p-6 
              ${colors.bg} ${colors.border}
              hover:shadow-md transition-shadow duration-200
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>
              <div className={`${colors.icon} opacity-80`}>
                <Icon className="w-8 h-8" />
              </div>
            </div>

            {/* Average Order Value */}
            {card.title === "Total Spent" && stats.averageOrderValue > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUpIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Avg: {formatCurrency(stats.averageOrderValue / 100)}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function OrdersStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsError() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 text-red-500">⚠</div>
        <p className="text-red-700 font-medium">Failed to load statistics</p>
      </div>
      <p className="text-red-600 text-sm mt-1">
        Please refresh the page to try again
      </p>
    </div>
  );
}
