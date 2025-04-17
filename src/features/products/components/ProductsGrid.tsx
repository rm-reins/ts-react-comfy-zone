import { useTranslation } from "@/i18n/useTranslation";
import { trpc } from "@/trpc/trpc";
import ProductCard from "./ProductCard";
import { Skeleton, Button, Filters } from "@/shared/ui";
import { Product } from "@/trpc/types";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

function ProductsGrid() {
  const { t } = useTranslation();
  const [sortOption, setSortOption] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const { data, isLoading, error } = trpc.product.getAll.useQuery();
  const products = data ? (data as unknown as Product[]) : [];

  // Reset to first page when sort or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption]);

  // Calculate pagination
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / pageSize);

  // Get current page of products
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalProducts);
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    const page = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="md:w-64">
          <Filters products={products} />
        </div>

        {/* Product grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-sm flex flex-col h-full"
                >
                  <Skeleton className="aspect-square w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              {t("common.error")}: {error.message}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Showing {startIndex + 1}-{endIndex} of {totalProducts}{" "}
                  products
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Sort by:
                  </span>
                  <div className="relative">
                    <select
                      className="appearance-none text-sm border rounded-md px-3 py-2 pr-8 bg-transparent"
                      value={sortOption}
                      onChange={handleSortChange}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest</option>
                      <option value="bestselling">Best Selling</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                  </div>
                </div>
              </div>

              {currentProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProducts.map((product: Product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex justify-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous page</span>
                        </Button>

                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          return (
                            <Button
                              key={pageNumber}
                              variant={
                                pageNumber === currentPage
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNumber)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next page</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">
                    {t("products.comingSoon")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("products.checkBackLater")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsGrid;
