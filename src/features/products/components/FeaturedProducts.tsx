import { useTranslation } from "@/i18n/useTranslation";
import { trpc } from "@/trpc/trpc";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/shared/ui";
import { Product } from "@/types/product";

function FeaturedProducts() {
  const { t } = useTranslation();

  const { data, isLoading, error } = trpc.product.getAll.useQuery();

  const featuredProducts = data
    ? (data as unknown as Product[])
        .filter((product: Product) => product.featured)
        .slice(0, 4)
    : [];

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        {t("products.featured")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
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
        ) : featuredProducts.length > 0 ? (
          featuredProducts.map((product: Product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))
        ) : (
          <div className="col-span-full p-4 border rounded-lg shadow-sm text-center flex flex-col h-full">
            <div className="h-48 bg-muted rounded-md mb-4"></div>
            <h3 className="text-xl font-semibold">
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

export default FeaturedProducts;
