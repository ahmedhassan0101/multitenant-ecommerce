"use client";
import { Input } from "@/components/ui/input";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import CategorySidebar from "./CategorySidebar";
import { Button } from "@/components/ui/button";
interface SearchInputProps {
  disabled?: boolean;
}
export default function SearchInput({ disabled }: SearchInputProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex items-center w-full gap-2">
      <CategorySidebar
        open={isSidebarOpen}
        onOpenChangeAction={setIsSidebarOpen}
      />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8"
          placeholder="Search products"
          disabled={disabled}
        />
      </div>
      <Button
        variant={"elevated"}
        className="flex size-12 shrink-0 lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
    </div>
  );
}
//
