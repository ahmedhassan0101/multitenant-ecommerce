"use client";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import PriceFilter from "./price-filter";
import { useProductFilters } from "../use-product-filters";

export default function ProductFilters() {
  const [filters, setFilters] = useProductFilters();


  const onChange = (key: keyof typeof filters, value: string | string[]) => {
    setFilters({ ...filters, [key]: value });
  };

  //  const onClear = () => {
  //   setFilters({ minPrice: "", maxPrice: "", tags: [] });
  // };

  return (
    <div className="bg-white border rounded-md">
      <CustomAccordionItem title="Price">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={onChange}
        />
      </CustomAccordionItem>

      <CustomAccordionItem title="Tags" className="border-b-0">
        ProductSort
      </CustomAccordionItem>
      <CustomAccordionItem title="Tags" className="border-b-0">
        TagsFilter
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
