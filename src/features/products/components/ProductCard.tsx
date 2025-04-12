import { Product } from "@/trpc/types";
import { useTranslation } from "@/i18n/useTranslation";
import { Link } from "react-router-dom";
import { Button, Image } from "@/shared/ui";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full">
      <Link
        to={`/products/${product._id}`}
        className="flex flex-col flex-grow"
      >
        <div className="h-48 bg-muted rounded-md mb-4 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h5 className=" font-semibold">{product.name}</h5>
        <p className="text-muted-foreground text-sm uppercase tracking-wide mb-2">
          {product.company}
        </p>

        <div className="flex gap-2  mb-8">
          {product.colors.map((color, index) => (
            <button
              key={index}
              className="w-6 h-6 rounded-full border border-gray-200 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 focus:outline-none"
              style={{ backgroundColor: color }}
              aria-label={`Select color ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex text-sm justify-between items-center mt-auto">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{product.averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-1">
              ({product.numOfReviews})
            </span>
          </div>
        </div>
      </Link>
      <div className="mt-4">
        <Button
          className="w-full"
          disabled={product.inventory === 0}
        >
          {product.inventory === 0
            ? t("products.outOfStock")
            : t("products.addToCart")}
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
