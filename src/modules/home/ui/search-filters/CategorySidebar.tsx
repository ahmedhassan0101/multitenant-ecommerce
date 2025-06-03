import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Category } from "@/payload-types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface CategorySidebarProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  categories: Category[];
}
export default function CategorySidebar({
  open,
  onOpenChangeAction,
  categories = [], // Default value to prevent undefined access
}: CategorySidebarProps) {
  const router = useRouter();

  const [subCategories, setSubCategories] = useState<
    Category["subcategories"] | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const currentCategories = subCategories?.docs ?? categories ?? [];
  const filteredCategories = currentCategories.filter(
    (cat): cat is Category => typeof cat !== "string"
  );
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setSubCategories(null);
      setSelectedCategory(null);
      onOpenChangeAction(open);
    },
    [onOpenChangeAction]
  );

  const handleCategoryClick = useCallback(
    (category: Category) => {
      const hasSubCategories =
        category.subcategories?.docs && category.subcategories.docs.length > 0;

      if (hasSubCategories) {
        // Navigate to subcategories
        setSubCategories(category.subcategories);
        setSelectedCategory(category);
      } else {
        // Navigate to category page
        const route =
          subCategories && selectedCategory
            ? `/${selectedCategory.slug}/${category.slug}` // subcategory route
            : category.slug === "all"
              ? "/"
              : `/${category.slug}`; // root category route

        router.push(route);
        handleOpenChange(false);
      }
    },
    [subCategories, selectedCategory, router, handleOpenChange]
  );

  const handleBackClick = useCallback(() => {
    setSubCategories(null);
    setSelectedCategory(null);
  }, []);
  // Safe color access with fallback
  const backgroundColor = selectedCategory?.color ?? "#ffffff";
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex flex-col h-full pb-2 overflow-y-auto">
          {/* Back button - only show when viewing subcategories */}
          {subCategories && (
            <button
              onClick={handleBackClick}
              className="flex items-center w-full p-4 text-base font-medium text-left transition-colors hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Go back to parent categories"
            >
              <ChevronLeftIcon className="mr-2 size-4" />
              Back
            </button>
          )}

          {/* Category list */}
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => {
              const hasSubcategories =
                category.subcategories?.docs &&
                category.subcategories.docs.length > 0;
              return (
                <button
                  key={category.slug}
                  className="flex items-center justify-between w-full p-4 text-base font-medium text-left transition-colors hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => handleCategoryClick(category)}
                  aria-label={
                    hasSubcategories
                      ? `View ${category.name} subcategories`
                      : `Navigate to ${category.name}`
                  }
                >
                  <span>{category.name}</span>
                  {hasSubcategories && (
                    <ChevronRightIcon className="size-4" aria-hidden="true" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              No categories available
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
