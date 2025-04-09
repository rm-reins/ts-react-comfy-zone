import { Product } from "@/types/product";
import { useTranslation } from "@/i18n/useTranslation";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();

  const getImageUrl = () => {
    if (!product.images || product.images.length === 0) {
      return "https://placehold.co/400x300";
    }

    const firstImage = product.images[0];

    // Mongo has urls stored as strings, but when the image is uploaded, it's stored as an object with numeric keys
    // idk, this code fixes the issue for now
    if (typeof firstImage === "string") {
      return firstImage;
    }
    if (typeof firstImage === "object") {
      const urlChars: string[] = [];
      let i = 0;

      while (i in firstImage) {
        urlChars.push(firstImage[i]);
        i++;
      }

      return urlChars.join("");
    }

    return "https://placehold.co/400x300";
  };

  const imageUrl = getImageUrl();

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <Link
        to={`/products/${product._id}`}
        className="flex flex-col flex-grow"
      >
        <div className="h-48 bg-muted rounded-md mb-4 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-muted-foreground mb-2 line-clamp-2 flex-grow">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
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
