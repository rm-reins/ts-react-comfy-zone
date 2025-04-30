import { Skeleton } from "@/shared/ui";
import { trpc } from "@/trpc/trpc";
import { Product } from "@/trpc/types";
import { useParams } from "react-router-dom";
import {
  ProductGallery,
  ProductInfo,
  ProductReviews,
} from "@/features/products";
import { useTranslation } from "@/i18n/useTranslation";

export default function SingleProduct() {
  const { language } = useTranslation();
  const { id } = useParams<{ id: string }>();

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

  // Handle loading state
  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Skeleton className="h-64 w-full dark:bg-green-900/30" />
          <Skeleton className="h-96 w-full dark:bg-green-900/30" />
          <Skeleton className="h-64 w-full dark:bg-green-900/30" />
        </div>
      </div>
    );
  }

  // Handle error state
  if (productError || !product) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 text-center bg-white dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
        <h2 className="text-2xl font-bold text-red-500 dark:text-red-400">
          Error loading product
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {productError?.message || "Product not found"}
        </p>
      </div>
    );
  }

  const productName = product.name[language];

  return (
    <div className="bg-background dark:bg-green-600 min-h-screen p-4 md:p-8 rounded-xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product Gallery Component */}
          <ProductGallery
            images={product.images}
            productName={productName}
          />

          {/* Product Info Component - Add a container with styling */}
          <div className="bg-white col-span-2 lg:col-span-1 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 shadow-sm">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Product Reviews Component - Add a container with styling */}
        <div className="bg-white dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 shadow-sm mt-8">
          <ProductReviews
            product={product}
            productId={id || ""}
          />
        </div>
      </div>
    </div>
  );
}
