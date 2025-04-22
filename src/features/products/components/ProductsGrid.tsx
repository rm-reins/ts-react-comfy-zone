import { useTranslation } from "@/i18n/useTranslation";
import ProductCard from "./ProductCard";
import { Skeleton, Pagination } from "@/shared/ui";
import { Product } from "@/trpc/types";
import { useState, useEffect, useMemo } from "react";
import { ChevronsUpDown } from "lucide-react";

interface ProductsGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error;
  filters?: {
    categories?: string[];
    colors?: string[];
    minPrice?: number;
    maxPrice?: number;
    companies?: string[];
  };
}

function ProductsGrid({
  products,
  isLoading,
  error,
  filters,
}: ProductsGridProps) {
  const { t } = useTranslation();
  const [sortOption, setSortOption] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    if (!filters) return products;

    return products.filter((product) => {
      // Filter by category
      if (
        filters.categories?.length &&
        !filters.categories.includes(
          product.category.toLowerCase().replace(/\s+/g, "-")
        )
      ) {
        return false;
      }

      // Filter by color
      if (
        filters.colors?.length &&
        !product.colors.some((color) =>
          filters.colors?.includes(color.toLowerCase().replace(/\s+/g, "-"))
        )
      ) {
        return false;
      }

      // Filter by price
      if (
        (filters.minPrice !== undefined && product.price < filters.minPrice) ||
        (filters.maxPrice !== undefined && product.price > filters.maxPrice)
      ) {
        return false;
      }

      // Filter by company
      if (
        filters.companies?.length &&
        !filters.companies.includes(
          product.company.toLowerCase().replace(/\s+/g, "-")
        )
      ) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const productsToSort = [...filteredProducts];

    switch (sortOption) {
      case "price-asc":
        return productsToSort.sort((a, b) => a.price - b.price);
      case "price-desc":
        return productsToSort.sort((a, b) => b.price - a.price);
      case "newest":
        return productsToSort.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return productsToSort;
    }
  }, [filteredProducts, sortOption]);

  // Reset to first page when sort or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption, filters]);

  // Calculate pagination
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);

  // Get current page of products
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalProducts);
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

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
        {/* Product grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className="group flex flex-col h-full"
                >
                  {/* Product image skeleton */}
                  <Skeleton className="aspect-square relative overflow-hidden rounded-xl bg-muted mb-3" />

                  {/* Product title skeleton */}
                  <Skeleton className="h-7 w-3/4 mb-2" />

                  {/* Category/type skeleton */}
                  <Skeleton className="h-5 w-1/3 mb-4" />

                  {/* Price skeleton */}
                  <Skeleton className="h-8 w-1/2 mt-auto" />
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
                  {t("products.found", { count: totalProducts })}
                </p>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      className="appearance-none text-sm px-3 py-2 pr-8 bg-transparent focus:outline-none focus:ring-0"
                      value={sortOption}
                      onChange={handleSortChange}
                    >
                      <option value="featured">{t("products.featured")}</option>
                      <option value="price-asc">
                        {t("products.priceLowToHigh")}
                      </option>
                      <option value="price-desc">
                        {t("products.priceHighToLow")}
                      </option>
                      <option value="newest">{t("products.newest")}</option>
                      <option value="bestselling">
                        {t("products.bestSelling")}
                      </option>
                    </select>
                    <ChevronsUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
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
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      className="mt-10"
                    />
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
