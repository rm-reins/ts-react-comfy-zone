import { Product } from "@/trpc/types";
import { Link } from "react-router-dom";
import { Image } from "@/shared/ui";
import { useTranslation } from "@/i18n/useTranslation";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { t, language } = useTranslation();

  const name = product.name[language];

  const formattedPrice = `${product.price.toFixed(2)}€`;

  return (
    <div className="group flex flex-col h-full">
      <Link
        to={`/products/${product._id}`}
        className="flex flex-col h-full"
      >
        <div className="aspect-square relative overflow-hidden rounded-xl bg-muted mb-3">
          <Image
            src={product.images[0]}
            alt={name}
            layout="fill"
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="text-lg font-medium">{name}</h3>
        <p className="text-muted-foreground mb-2 capitalize">
          {t(`products.categoryType.${product.category}`)}
        </p>
        <p className="font-medium mt-auto dark:text-white">{formattedPrice}</p>
      </Link>
    </div>
  );
}

export default ProductCard;
