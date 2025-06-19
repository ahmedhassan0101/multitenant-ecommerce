"use client";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import PriceFilter from "./price-filter";
import { useProductFilters } from "../use-product-filters";
import TagsFilter from "./tags-filter";
import { Button } from "@/components/ui/button";

export default function ProductFilters() {
  const [filters, setFilters] = useProductFilters();

  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") return false;
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "string") {
      return value !== "";
    }
    return value !== null;
  });

  const onChange = (key: keyof typeof filters, value: string | string[]) => {
    setFilters({ ...filters, [key]: value });
  };
  const onClear = () => {
    setFilters({ minPrice: "", maxPrice: "", tags: [] });
  };

  console.log("🚀 ~ ProductFilters ~ hasAnyFilters:", filters);
  return (
    <div className="bg-white border rounded-md">
      <div className="flex items-center justify-between p-4 border-b">
        <p className="font-medium">Filters</p>
        {hasAnyFilters && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onClear}
            type="button"
          >
            Clear
          </Button>
        )}
      </div>
      <CustomAccordionItem title="Price">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={onChange}
        />
      </CustomAccordionItem>

      <CustomAccordionItem title="Tags" className="border-b-0">
        <TagsFilter
          value={filters.tags}
          onChange={(tags) => onChange("tags", tags)}
        />
      </CustomAccordionItem>
    </div>
  );
}

interface Props {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const CustomAccordionItem = ({ title, className, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn("flex flex-col gap-2 border-b p-4", className)}>
      <button
        type="button"
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="font-medium">{title}</p>
        <Icon className="size-5" />
      </button>
      {isOpen && children}
    </div>
  );
};
