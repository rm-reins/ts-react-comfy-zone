import { useState, useEffect } from "react";
import { Image, Skeleton } from "@/shared/ui";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Plus,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/utils/utils";
import { trpc } from "@/trpc/trpc";
import { Review, Product } from "@/trpc/types";
import { keepPreviousData } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "@/i18n/useTranslation";

export default function SingleProduct() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [openSection, setOpenSection] = useState<string>("description");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(4);

  // Fetch the product - pass ID directly as a string
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = trpc.product.getById.useQuery(id || "", {
    enabled: !!id,
    retry: false,
  });

  // Type assertion for the product
  const product = productData as Product;

  // Fetch reviews for the product
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = trpc.review.getSingleProductReviews.useQuery(
    {
      productId: id || "",
      pagination: { page: currentPage, limit: reviewsPerPage },
    },
    { enabled: !!id, placeholderData: keepPreviousData }
  );

  // Reset page when product changes
  useEffect(() => {
    setCurrentPage(1);
  }, [id]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  // Handle loading state
  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Handle error state
  if (productError || !product) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500">
          Error loading product
        </h2>
        <p className="text-gray-600">
          {productError?.message || "Product not found"}
        </p>
      </div>
    );
  }

  // Handle reviews data
  const reviews = (reviewsData?.docs as unknown as Review[]) || [];
  const totalPages = reviewsData?.totalPages || 1;
  const hasNextPage = reviewsData?.hasNextPage || false;
  const hasPrevPage = reviewsData?.hasPrevPage || false;

  return (
    <div className="bg-background min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Left Column - Title and Thumbnails */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              {product.name}
            </h1>

            <div className="grid grid-cols-3 gap-3">
              {product.images
                .slice(0, 3)
                .map((image: string, index: number) => (
                  <div key={`thumb-${index}`}>
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      layout="responsive"
                      objectFit="cover"
                      key={index}
                      className={cn(
                        "bg-white rounded-xl overflow-hidden cursor-pointer",
                        selectedImage === index &&
                          "ring-2 ring-primary dark:ring-white"
                      )}
                      onClick={() => setSelectedImage(index)}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Middle Column - Main Image */}

          <Image
            src={product.images[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            objectFit="fill"
            priority
            className="rounded-xl max-h-[calc(100vw*(4/3))]"
          />

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="text-gray-500 dark:text-gray-200">
                  SKU: {product._id.substring(0, 8)}
                </div>

                <div>
                  <div className="text-gray-500 mb-2 dark:text-gray-200">
                    {t("products.color")}
                  </div>
                  <div className="flex gap-2">
                    {product.colors.map((color: string, index: number) => (
                      <button
                        key={index}
                        className={cn(
                          "w-6 h-6 rounded-full border",
                          selectedColor === index &&
                            "ring-2 ring-offset-2 ring-primary"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(index)}
                        aria-label={`Select color ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold">
                ${product.price.toFixed(2)}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-2 flex items-center gap-1 flex-1 justify-center font-medium transition-colors">
                <Plus className="w-4 h-4" />
                {t("products.addToCart")}
              </button>
              <button className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full p-2 aspect-square flex items-center justify-center transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-3 text-primary">
              <div className="p-4 bg-white text-gray-600 rounded-xl">
                <p>{product.description}</p>
              </div>
              <div className="border rounded-xl overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 bg-white"
                  onClick={() => toggleSection("details")}
                >
                  <span className="font-medium uppercase">
                    {t("products.productDetails")}
                  </span>
                  {openSection === "details" ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {openSection === "details" && (
                  <div className="p-4 bg-white text-gray-600">
                    <p className="capitalize">
                      {t("products.category")}: {product.category}
                    </p>
                    <p>
                      {t("products.company")}: {product.company}
                    </p>
                  </div>
                )}
              </div>

              <div className="border rounded-xl overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 bg-white"
                  onClick={() => toggleSection("shipping")}
                >
                  <span className="font-medium uppercase">
                    {t("products.shippingAndReturns")}
                  </span>
                  {openSection === "shipping" ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {openSection === "shipping" && (
                  <div className="p-4 bg-white text-gray-600">
                    <p>{t("products.shippingTerms")}</p>
                    <p>{t("products.shippingReturns")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
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

              {/* Enhanced Pagination */}
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
                      onClick={() =>
                        hasPrevPage && setCurrentPage(currentPage - 1)
                      }
                      disabled={!hasPrevPage}
                      aria-label="Previous page"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {t("common.back")}
                      </span>
                    </button>

                    <div className="flex gap-1">
                      {totalPages <= 5 ? (
                        // Show all pages if 5 or fewer
                        Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (page) => (
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
                          )
                        )
                      ) : (
                        // Show first, last, and pages around current if more than 5
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

                          {currentPage > 3 && (
                            <span className="px-1 text-primary">...</span>
                          )}

                          {Array.from(
                            { length: Math.min(3, totalPages - 2) },
                            (_, i) => {
                              let pageNum;
                              if (currentPage <= 2) pageNum = i + 2;
                              else if (currentPage >= totalPages - 1)
                                pageNum = totalPages - 3 + i;
                              else pageNum = currentPage - 1 + i;
                              return pageNum <= totalPages - 1 &&
                                pageNum >= 2 ? (
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
                            }
                          )}

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
                      )}
                    </div>

                    <button
                      className={cn(
                        "flex items-center gap-1 font-medium px-3 py-2 rounded-full transition-colors",
                        hasNextPage
                          ? "hover:bg-primary/10 text-primary"
                          : "text-gray-300 cursor-not-allowed"
                      )}
                      onClick={() =>
                        hasNextPage && setCurrentPage(currentPage + 1)
                      }
                      disabled={!hasNextPage}
                      aria-label="Next page"
                    >
                      <span className="hidden sm:inline">
                        {t("common.next")}
                      </span>
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
      </div>
    </div>
  );
}
