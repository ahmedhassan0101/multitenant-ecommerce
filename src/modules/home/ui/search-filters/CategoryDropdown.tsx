"use client";
import { useRef, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useDropdownPosition from "./useDropdownPosition";
import SubCategoryMenu from "./SubCategoryMenu";
import { CategoriesGetAll } from "@/modules/categories/types";

//1- search-filters\CategoryDropdown.tsx
interface CategoryDropdownProps {
  category: CategoriesGetAll[1];
  isActive?: boolean;
  isNavigationHovered?: boolean;
}

export default function CategoryDropdown({
  category,
  isActive,
  isNavigationHovered,
}: CategoryDropdownProps) {
  //! dropdown Logic-----------------------------
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const getDropdownPosition = useDropdownPosition(dropdownRef);
  const dropdownPosition = getDropdownPosition();
  //! dropdown Logic-----------------------------

  //! Hover Logic-----------------------------
  const hasSubcategories =
    Array.isArray(category.subcategories?.docs) &&
    category.subcategories.docs.length > 0;
  const onMouseEnter = () => {
    if (hasSubcategories) {
      setIsOpen(true);
    }
  };
  const onMouseLeave = () => setIsOpen(false);
  const toggleDropdown = () => {
    if (hasSubcategories) {
      setIsOpen((prev) => !prev);
    }
  };
  //! Hover Logic-----------------------------

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={toggleDropdown}
    >
      <div className="relative">
        <Button
          asChild
          variant={"elevated"}
          className={cn(
            "hover:border-primary h-11 rounded-full border-transparent bg-transparent px-4 text-black hover:bg-white",
            isActive && !isNavigationHovered && "border-primary bg-white",
            isOpen &&
              "border-primary -translate-y-[4px transition-all] -translate-x-[4px] bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          )}
        >
          <Link href={`/${category.slug === "all" ? "/" : category.slug}`}>
            {category.name}
          </Link>
        </Button>
        {hasSubcategories && (
          <div
            className={cn(
              "absolute -bottom-3 left-1/2 h-0 w-0 -translate-x-1/2 border-r-[10px] border-b-[10px] border-l-[10px] border-r-transparent border-b-black border-l-transparent opacity-0",
              isOpen && "opacity-100"
            )}
          />
        )}
      </div>
      <SubCategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  );
}
