import { cn } from "@/utils/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showNavLabels?: boolean;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showNavLabels = false,
  className,
}: PaginationProps) {
  const { t } = useTranslation();
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm">
        <button
          className={cn(
            "flex items-center gap-1 font-medium px-3 py-2 rounded-full transition-colors",
            hasPrevPage
              ? "hover:bg-primary/10 text-primary"
              : "text-gray-300 cursor-not-allowed"
          )}
          onClick={() => hasPrevPage && onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          {showNavLabels && (
            <span className="hidden sm:inline">{t("common.back")}</span>
          )}
        </button>

        <div className="flex gap-1">
          {renderPaginationButtons(currentPage, totalPages, onPageChange)}
        </div>

        <button
          className={cn(
            "flex items-center gap-1 font-medium px-3 py-2 rounded-full transition-colors",
            hasNextPage
              ? "hover:bg-primary/10 text-primary"
              : "text-gray-300 cursor-not-allowed"
          )}
          onClick={() => hasNextPage && onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          aria-label="Next page"
        >
          {showNavLabels && (
            <span className="hidden sm:inline">{t("common.next")}</span>
          )}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Helper function to render pagination buttons
function renderPaginationButtons(
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) {
  if (totalPages <= 5) {
    // Show all pages if 5 or fewer
    return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          currentPage === page
            ? "bg-primary text-white"
            : "hover:bg-primary/10 text-gray-600"
        )}
        onClick={() => onPageChange(page)}
      >
        {page}
      </button>
    ));
  }

  // Show first, last, and pages around current if more than 5
  return (
    <>
      <button
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          currentPage === 1
            ? "bg-primary text-white"
            : "hover:bg-primary/10 text-gray-600"
        )}
        onClick={() => onPageChange(1)}
      >
        1
      </button>

      {currentPage > 3 && <span className="px-1 text-primary">...</span>}

      {Array.from({ length: Math.min(3, totalPages - 2) }, (_, i) => {
        let pageNum;
        if (currentPage <= 2) pageNum = i + 2;
        else if (currentPage >= totalPages - 1) pageNum = totalPages - 3 + i;
        else pageNum = currentPage - 1 + i;
        return pageNum <= totalPages - 1 && pageNum >= 2 ? (
          <button
            key={pageNum}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              currentPage === pageNum
                ? "bg-primary text-white"
                : "hover:bg-primary/10 text-gray-600"
            )}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        ) : null;
      })}

      {currentPage < totalPages - 2 && (
        <span className="px-1 text-primary">...</span>
      )}

      <button
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          currentPage === totalPages
            ? "bg-primary text-white"
            : "hover:bg-primary/10 text-gray-600"
        )}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>
    </>
  );
}

export default Pagination;
