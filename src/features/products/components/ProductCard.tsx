import { Product } from "@/trpc/types";
import { Link } from "react-router-dom";
import { Image } from "@/shared/ui";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = `${product.price.toFixed(2)}€`;

  return (
    <div className="group flex flex-col h-full">
      <Link
        to={`/products/${product._id}`}
        className="flex flex-col h-full"
      >
        <div className="aspect-square relative overflow-hidden rounded-lg bg-muted mb-3">
          <Image
            src={product.images[0]}
            alt={product.name}
            className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="text-muted-foreground mb-2 capitalize">
          {product.category}
        </p>
        <p className="font-medium mt-auto dark:text-white">{formattedPrice}</p>
      </Link>
    </div>
  );
}

export default ProductCard;
