import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/utils/utils";
import { Product } from "@/trpc/types";
import { useTranslation } from "@/i18n/useTranslation";
import ProductAccordion from "./ProductAccordion";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/features/cart/cartSlice";
import { Button } from "@/shared";
import { useToast } from "@/shared/ui";

interface ProductInfoProps {
  product: Product;
}

function ProductInfo({ product }: ProductInfoProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [selectedColor, setSelectedColor] = useState(0);
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    try {
      dispatch(
        addItem({
          ...product,
          color: product.colors[selectedColor],
          quantity: 1,
        })
      );
      showToast({
        title: t("products.addedToCart"),
        description: t("products.addedToCartDescription"),
        variant: "success",
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      showToast({
        title: t("common.error"),
        description:
          error instanceof Error
            ? error.message
            : t("products.errorAddingToCart"),
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col justify-between items-start">
        <div className="space-y-4">
          <div className="text-gray-500 dark:text-gray-200">
            SKU: {product._id.substring(0, 8)}
          </div>

          <div>
            <div className="text-gray-500 mb-2 dark:text-gray-200">
              {t("products.color")}
            </div>
            <div className="flex gap-2 sm:mb-0 mb-2">
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
          {`${product.price.toFixed(2)} €`}
        </div>
      </div>

      <div>
        <Button
          variant="default"
          size="xl"
          className="w-full"
          onClick={handleAddToCart}
        >
          <Plus className="w-4 h-4" />
          {t("products.addToCart")}
        </Button>
      </div>

      {/* Product Details Accordion */}
      <ProductAccordion product={product} />
    </div>
  );
}

export default ProductInfo;
