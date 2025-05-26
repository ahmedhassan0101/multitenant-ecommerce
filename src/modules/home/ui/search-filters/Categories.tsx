import React from "react";
import CategoryDropdown from "./CategoryDropdown";
import { Category } from "@/payload-types";

export default function Categories({ categories }: { categories: Category[] }) {

  return (
    <div className="relative w-full">
      {/* Hidden div to measure all items */}
      {/*  opacity-0  absolute*/}
      <div className="flex ">
        {categories.map((category : Category) => (
          <CategoryDropdown
            key={category.id}
            category={category}
            isActive={false}
            isNavigationHovered={false}
          />
        ))}
      </div>
      {/* Visible Items */}
      {/* <div>Visible Items</div> */}
    </div>
  );
}

// pointer-events-none