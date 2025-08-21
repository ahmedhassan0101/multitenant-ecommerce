"use client";
import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import CategorySidebar from "./CategorySidebar";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface SearchInputProps {
  disabled?: boolean;
  defaultValue?: string | undefined;
  onChange?: (value: string) => void;
}
export default function SearchInput({
  disabled,
  defaultValue,
  onChange,
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(defaultValue || "");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC();
  const { data: session } = useQuery(trpc.auth.session.queryOptions());

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange?.(searchValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, onChange]);

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
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <Button
        variant={"elevated"}
        className="flex size-12 shrink-0 lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
      {session?.user && (
        <Button asChild variant={"elevated"}>
          <Link href="/library">
            <BookmarkCheckIcon />
            Library
          </Link>
        </Button>
      )}
    </div>
  );
}
//
