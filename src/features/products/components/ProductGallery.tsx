import { useState } from "react";
import { Image } from "@/shared/ui";
import { cn } from "@/utils/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Product Name - Always at top */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold break-words hyphens-auto">
        {productName}
      </h1>

      {/* Main Image */}
      <div className="relative">
        <Image
          src={images[selectedImage] || "/placeholder.svg"}
          alt={productName}
          layout="responsive"
          objectFit="cover"
          priority
          className="rounded-xl lg:max-w-xl max-w-lg"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-3">
        {images.slice(0, 3).map((image: string, index: number) => (
          <div key={`thumb-${index}`}>
            <Image
              src={image || "/placeholder.svg"}
              alt={`${productName} thumbnail ${index + 1}`}
              layout="responsive"
              objectFit="cover"
              key={index}
              className={cn(
                "bg-white rounded-xl overflow-hidden cursor-pointer",
                selectedImage === index && "ring-2 ring-primary dark:ring-white"
              )}
              onClick={() => setSelectedImage(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
