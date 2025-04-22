import { useState, useEffect } from "react";
import { Skeleton, Pagination } from "@/shared/ui";
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

  return (
    <div className="mt-5 mb-5">
      <h2 className="text-2x  l sm:text-3xl font-bold text-center mb-10">
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
                <div className="flex sm:flex-row flex-col justify-between mb-4">
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showNavLabels={false}
              className="mt-8"
            />
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

export default ProductReviews;
