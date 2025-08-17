"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon, SearchIcon, XIcon, CalendarIcon } from "lucide-react";
// import { useOrdersFilters } from "../hooks/use-orders-filters";

export default function OrdersFilters() {
  // const { filters, updateFilters, resetFilters, hasActiveFilters } = useOrdersFilters();
  const isExpanded = false;

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
    { value: "failed", label: "Failed" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {/* {hasActiveFilters && ( */}
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            Active
          </span>
          {/* )} */}
        </div>

        <div className="flex items-center gap-2">
          {/* {hasActiveFilters && ( */}
          <Button
            variant="ghost"
            size="sm"
            // onClick={resetFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="w-4 h-4 mr-1" />
            Clear
          </Button>
          {/* )} */}
          <Button
            variant="ghost"
            size="sm"
            // onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Less" : "More"} Filters
          </Button>
        </div>
      </div>

      {/* Basic Filters - Always Visible */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by order number..."
              // value={filters.search || ''}
              // onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select
          // value={filters.status || 'all'}
          // onValueChange={(value) => updateFilters({ status: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Quick Date Filters */}
          <Select
          // onValueChange={(value) => {
          //   const now = new Date();
          //   let dateFrom: string | undefined;

          //   switch (value) {
          //     case 'last-week':
          //       dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          //       break;
          //     case 'last-month':
          //       dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
          //       break;
          //     case 'last-3-months':
          //       dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
          //       break;
          //     default:
          //       dateFrom = undefined;
          //   }

          //   updateFilters({ dateFrom, dateTo: undefined });
          // }}
          >
            <SelectTrigger>
              <CalendarIcon className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Custom Date Range
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <Input
                  type="date"
                  // value={filters.dateFrom ? new Date(filters.dateFrom).toISOString().split('T')[0] : ''}
                  // onChange={(e) => {
                  //   const dateFrom = e.target.value
                  //     ? new Date(e.target.value).toISOString()
                  //     : undefined;
                  //   updateFilters({ dateFrom });
                  // }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <Input
                  type="date"
                  // value={filters.dateTo ? new Date(filters.dateTo).toISOString().split('T')[0] : ''}
                  // onChange={(e) => {
                  //   const dateTo = e.target.value
                  //     ? new Date(e.target.value).toISOString()
                  //     : undefined;
                  //   updateFilters({ dateTo });
                  // }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
