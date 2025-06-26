"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
interface TagsFilterProps {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

export default function TagsFilter({ value, onChange }: TagsFilterProps) {
  const trpc = useTRPC();

  const {
    data: tagPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.tags.getAll.infiniteQueryOptions(
      { limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
      }
    )
  );

  const handleTagChange = (tag: string) => {
    onChange(
      value?.includes(tag)
        ? value.filter((t) => t !== tag)
        : [...(value || []), tag]
    );
  };
  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        <div className="my-4">
          {tagPages?.pages.map((page) =>
            page.docs.map((tag) => (
              <div className="flex items-center justify-between" key={tag.id}>
                <button
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleTagChange(tag?.name)}
                >
                  <p className="font-medium">{tag.name}</p>
                </button>
                <Checkbox
                  className="cursor-pointer"
                  checked={value?.includes(tag.name)}
                  onCheckedChange={() => handleTagChange(tag.name)}
                />
              </div>
            ))
          )}
        </div>
      )}
      {hasNextPage && (
        <Button
          variant={"ghost"}
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="m-auto w-36 font-medium cursor-pointer disabled:opacity-50"
        >
          Load more
        </Button>
      )}
    </div>
  );
}
