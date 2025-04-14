import { useTranslation } from "@/i18n/useTranslation";
import { trpc } from "@/trpc/trpc";
import ProductCard from "./ProductCard";
import { Skeleton, Button, Filters } from "@/shared/ui";
import { Product } from "@/trpc/types";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

function ProductsGrid() {
  const { t } = useTranslation();
  const [sortOption, setSortOption] = useState("featured");
  const { data, isLoading, error } = trpc.product.getAll.useQuery();

  const products = data ? (data as unknown as Product[]) : [];
  const totalProducts = 156; // TODO: get from API
  const displayedProducts = products.length || 24;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    // TODO: Implement filters reducer & context
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="md:w-64">
          <Filters />
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
                  Showing {displayedProducts} of {totalProducts} products
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

              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: Product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                      />
                    ))}
                  </div>

                  {/* TODO: implement pagination */}
                  <div className="mt-10 flex justify-center">
                    <Button variant="outline">Load More</Button>
                  </div>
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
