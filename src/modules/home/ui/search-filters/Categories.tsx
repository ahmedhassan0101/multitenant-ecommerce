"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import CategoryDropdown from "./CategoryDropdown";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategorySidebar from "./CategorySidebar";
import { CategoriesGetAll } from "@/modules/categories/types";

export default function Categories({
  categories,
}: {
  categories: CategoriesGetAll;
}) {
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(categories.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeCategory = (params?.category as string) ?? "all";
  // console.log("🚀 ~ activeCategory:", activeCategory);

  const activeCategoryIndex = categories.findIndex(
    (cat) => cat.slug === activeCategory
  );
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;
      // console.log("🚀 ~ calculateVisible ~ items:", items);
      for (const item of items) {
        const width = item.getBoundingClientRect().width;
        if (totalWidth + width > availableWidth) break;
        totalWidth += width;
        visible++;
      }
      setVisibleCount(visible);
    };

    const resizeObserver = new ResizeObserver(calculateVisible);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [categories.length]);

  return (
    <div className="relative w-full">
      <CategorySidebar
        open={isSidebarOpen}
        onOpenChangeAction={setIsSidebarOpen}
      />
      {/* Hidden div to measure all items */}
      <div
        ref={measureRef}
        className="absolute flex opacity-0 pointer-events-none"
        style={{ position: "fixed", top: -9999, left: -9999 }}
      >
        {categories.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={category.slug === activeCategory}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>

      {/* Visible Items */}
      <div
        ref={containerRef}
        role="menu"
        tabIndex={0}
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsAnyHovered(true);
          }
        }}
        className="flex flex-nowrap items-center"
      >
        {categories.slice(0, visibleCount).map((category) => (
          <CategoryDropdown
            key={category.id}
            category={category}
            isActive={category.slug === activeCategory}
            isNavigationHovered={false}
          />
        ))}
        <div ref={viewAllRef} className="shrink-0">
          <Button
            className={cn(
              "hover:border-primary h-11 rounded-full border-transparent bg-transparent px-4 text-black hover:bg-white",
              isActiveCategoryHidden &&
                !isAnyHovered &&
                "border-primary bg-white"
            )}
            onClick={() => setIsSidebarOpen(true)}
            variant={"elevated"}
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
