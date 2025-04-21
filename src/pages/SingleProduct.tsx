import { Skeleton } from "@/shared/ui";
import { trpc } from "@/trpc/trpc";
import { Product } from "@/trpc/types";
import { useParams } from "react-router-dom";
import {
  ProductGallery,
  ProductInfo,
  ProductReviews,
} from "@/features/products";

export default function SingleProduct() {
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

  return (
    <div className="bg-background min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product Gallery Component */}
          <ProductGallery
            images={product.images}
            productName={product.name}
          />

          {/* Product Info Component */}
          <ProductInfo product={product} />
        </div>

        {/* Product Reviews Component */}
        <ProductReviews
          product={product}
          productId={id || ""}
        />
      </div>
    </div>
  );
}
