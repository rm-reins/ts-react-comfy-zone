import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/utils/utils";
import { Product } from "@/trpc/types";
import { useTranslation } from "@/i18n/useTranslation";
import ProductAccordion from "./ProductAccordion";
import { useDispatch } from "react-redux";
import { addItem } from "@/features/cart/cartSlice";
import { Button } from "@/shared";

interface ProductInfoProps {
  product: Product;
}

function ProductInfo({ product }: ProductInfoProps) {
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState(0);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addItem({
        ...product,
        color: product.colors[selectedColor],
        quantity: 1,
      })
    );
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
