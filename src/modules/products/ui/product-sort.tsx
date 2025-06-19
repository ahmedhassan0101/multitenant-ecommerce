"use client";

import React from "react";
import { useProductFilters } from "../use-product-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sortOptions, sortValues } from "@/lib/constants";
import { poppins } from "@/modules/home/ui/Navbar";

export default function ProductSort() {
  const [filters, setFilters] = useProductFilters();

  const handleSortChange = (value: (typeof sortValues)[number]) => {
    setFilters({ ...filters, sort: value });
  };
  return (
    <div className="flex flex-col justify-between gap-y-2 lg:flex-row lg:items-center lg:gap-y-0">
      <p className={cn("text-2xl font-medium", poppins.className)}>
        Curated for you
      </p>
      <div className="flex items-center gap-2">
        {sortOptions.map((option) => {
          const isActive = filters.sort === option.value;
          return (
            <Button
              key={option.value}
              size="sm"
              variant="secondary"
              onClick={() => handleSortChange(option.value)}
              className={cn(
                "rounded-full",
                isActive
                  ? "bg-white hover:bg-white"
                  : "bg-transparent hover:bg-transparent border-transparent hover:border-border"
              )}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
