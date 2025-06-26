import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationComponentProps) {
  // Add safety checks for NaN values
  const safePage = Number.isInteger(currentPage) ? currentPage : 1;
  const safeItemsPerPage = Number.isInteger(itemsPerPage) ? itemsPerPage : 12;
  const safeTotalItems = Number.isInteger(totalItems) ? totalItems : 0;
  const safeTotalPages = Number.isInteger(totalPages) ? totalPages : 1;

  const generatePageNumbers = () => {
    const pages = [];
    const showEllipsis = safeTotalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (safePage > 4) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, safePage - 1);
      const end = Math.min(safeTotalPages - 1, safePage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safePage < safeTotalPages - 3) {
        pages.push("ellipsis-end");
      }

      if (safeTotalPages > 1) {
        pages.push(safeTotalPages);
      }
    }

    return pages;
  };

  const startItem = (safePage - 1) * safeItemsPerPage + 1;
  const endItem = Math.min(safePage * safeItemsPerPage, safeTotalItems);

  // Don't render if no items
  if (safeTotalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      {/* Results info */}
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {safeTotalItems} results
      </div>

      {/* Only show pagination if there are multiple pages */}
      {safeTotalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => safePage > 1 && onPageChange(safePage - 1)}
                className={
                  safePage <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {generatePageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis-start" || page === "ellipsis-end" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => onPageChange(page as number)}
                    isActive={safePage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  safePage < safeTotalPages && onPageChange(safePage + 1)
                }
                className={
                  safePage >= safeTotalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
