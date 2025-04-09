import { useTranslation } from "@/i18n/useTranslation";
import { trpc } from "@/trpc/trpc";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/shared/ui";
import { Product } from "@/types/product";

function ProductsGrid() {
  const { t } = useTranslation();

  const { data, isLoading, error } = trpc.product.getAll.useQuery();

  const products = data ? (data as unknown as Product[]) : [];

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-sm flex flex-col h-full"
            >
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2 flex-grow" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full mt-auto" />
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center text-red-500">
            {t("common.error")}: {error.message}
          </div>
        ) : products.length > 0 ? (
          products.map((product: Product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-2">
              {t("products.comingSoon")}
            </h3>
            <p className="text-muted-foreground flex-grow">
              {t("products.checkBackLater")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsGrid;
