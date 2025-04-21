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
    <>
      {/* Left Column - Thumbnails */}
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          {productName}
        </h1>

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
                  selectedImage === index &&
                    "ring-2 ring-primary dark:ring-white"
                )}
                onClick={() => setSelectedImage(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Image */}
      <Image
        src={images[selectedImage] || "/placeholder.svg"}
        alt={productName}
        objectFit="fill"
        priority
        className="rounded-xl max-h-[calc(100vw*(4/3))]"
      />
    </>
  );
}

export default ProductGallery;
