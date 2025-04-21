import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/utils/utils";
import { Skeleton } from "@/shared/ui";
import { trpc } from "@/trpc/trpc";
import { Review, Product } from "@/trpc/types";
import { keepPreviousData } from "@tanstack/react-query";
import { useTranslation } from "@/i18n/useTranslation";

interface ProductReviewsProps {
  product: Product;
  productId: string;
}

function ProductReviews({ product, productId }: ProductReviewsProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(4);

  // Fetch reviews for the product
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = trpc.review.getSingleProductReviews.useQuery(
    {
      productId: productId,
      pagination: { page: currentPage, limit: reviewsPerPage },
    },
    { enabled: !!productId, placeholderData: keepPreviousData }
  );

  // Reset page when product changes
  useEffect(() => {
    setCurrentPage(1);
  }, [productId]);

  // Handle reviews data
  const reviews = (reviewsData?.docs as unknown as Review[]) || [];
  const totalPages = reviewsData?.totalPages || 1;
  const hasNextPage = reviewsData?.hasNextPage || false;
  const hasPrevPage = reviewsData?.hasPrevPage || false;

  return (
    <div className="mt-20 mb-10">
      <h2 className="text-3xl font-bold text-center mb-10">
        {t("products.productReviews")}{" "}
        <span className="text-yellow-500 mr-1">★</span>
        <span className="dark:text-green-50">
          {product.averageRating.toFixed(1)}
        </span>
        <span className="text-muted-foreground ml-1">
          ({product.numOfReviews})
        </span>
      </h2>

      {reviewsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="h-40 w-full"
              />
            ))}
        </div>
      ) : reviewsError ? (
        <div className="text-center py-10 bg-white rounded-xl border">
          <p className="text-red-500">
            {reviewsError.message || t("common.errorLoadingReviews")}
          </p>
          <button
            className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90"
            onClick={() => refetchReviews()}
          >
            {t("common.tryAgain")}
          </button>
        </div>
      ) : reviews.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-xl p-6 border"
              >
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-primary">
                      {review.user?.toUpperCase() ||
                        `${review?.userSurname} ${review?.userName}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < review.rating
                                ? "text-primary"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <h4 className="font-medium mb-1 text-green-500">
                  {review.title}
                </h4>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8">
              <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm">
                <button
                  className={cn(
                    "flex items-center gap-1 font-medium px-3 py-2 rounded-full transition-colors",
                    hasPrevPage
                      ? "hover:bg-primary/10 text-primary"
                      : "text-gray-300 cursor-not-allowed"
                  )}
                  onClick={() => hasPrevPage && setCurrentPage(currentPage - 1)}
                  disabled={!hasPrevPage}
                  aria-label="Previous page"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("common.back")}</span>
                </button>

                <div className="flex gap-1">
                  {renderPaginationButtons(
                    currentPage,
                    totalPages,
                    setCurrentPage
                  )}
                </div>

                <button
                  className={cn(
                    "flex items-center gap-1 font-medium px-3 py-2 rounded-full transition-colors",
                    hasNextPage
                      ? "hover:bg-primary/10 text-primary"
                      : "text-gray-300 cursor-not-allowed"
                  )}
                  onClick={() => hasNextPage && setCurrentPage(currentPage + 1)}
                  disabled={!hasNextPage}
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">{t("common.next")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10 bg-white rounded-xl border">
          <p className="text-gray-500">{t("products.noReviewsYet")}</p>
          <button className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90">
            {t("products.beTheFirstToReview")}
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function to render pagination buttons
function renderPaginationButtons(
  currentPage: number,
  totalPages: number,
  setCurrentPage: (page: number) => void
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
        onClick={() => setCurrentPage(page)}
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
        onClick={() => setCurrentPage(1)}
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
            onClick={() => setCurrentPage(pageNum)}
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
        onClick={() => setCurrentPage(totalPages)}
      >
        {totalPages}
      </button>
    </>
  );
}

export default ProductReviews;
