import React from "react";
import Link from "next/link";
import { Order, Product, User } from "@/payload-types";
import {
  formatCurrency,
  // formatDate
} from "@/lib/utils";
import {
  CalendarIcon,
  CreditCardIcon,
  UserIcon,
  ExternalLinkIcon,
  PackageIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductItem } from "./ProductItem";

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const user = order.user as User;
  const products = order.products as Product[];

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: ClockIcon,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    processing: {
      label: "Processing",
      icon: RefreshCwIcon,
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    completed: {
      label: "Completed",
      icon: CheckCircleIcon,
      className: "bg-green-100 text-green-800 border-green-200",
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircleIcon,
      className: "bg-red-100 text-red-800 border-red-200",
    },
    refunded: {
      label: "Refunded",
      icon: RefreshCwIcon,
      className: "bg-purple-100 text-purple-800 border-purple-200",
    },
    failed: {
      label: "Failed",
      icon: XCircleIcon,
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };

  // const currentStatus = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
  const currentStatus = statusConfig.refunded;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.id.slice(-8)}
            </h3>
            <Badge
              variant="secondary"
              className={`${currentStatus.className} border font-medium`}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {currentStatus.label}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{orderDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <UserIcon className="w-4 h-4" />
              <span>{user.username || user.email}</span>.
             
            </div>
            <div className="flex items-center gap-1">
              <PackageIcon className="w-4 h-4" />
              <span>
                {products.length} item
                {products.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-lg font-bold text-gray-900 mb-1">
            <CreditCardIcon className="w-5 h-5 text-gray-400" />
            {formatCurrency(order.totalAmount / 100)}
          </div>
          <p className="text-sm text-gray-500">USD</p>
        </div>
      </div>

      {/* Products */}
      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Items in this order
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
            //  Property 'id' does not exist on type 'string | Product'.
            // Property 'id' does not exist on type 'string'
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">Order ID: {order.id}</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/library/${order.id}`}>
              <ExternalLinkIcon className="w-4 h-4 mr-1" />
              View Details
            </Link>
          </Button>

          {/* {order.status === 'completed' && ( */}
          <Button variant="outline" size="sm">
            Download Invoice
          </Button>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
