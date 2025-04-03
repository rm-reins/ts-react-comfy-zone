import { useState, useRef, type TouchEvent, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components";

interface HeroCarouselProps {
  images: {
    src: string;
    alt: string;
  }[];
  buttonText: string;
  onButtonClick: () => void;
}

export default function HeroCarousel({
  images,
  buttonText,
  onButtonClick = () => {},
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Add touch tracking refs
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Add touch event handlers for swipe functionality
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleMouseDown = (e: MouseEvent) => {
    isDragging.current = true;
    touchStartX.current = e.clientX;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      handleSwipe();
    }
  };

  const handleSwipe = () => {
    // Minimum swipe distance (in px) to trigger navigation
    const minSwipeDistance = 50;
    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      // Swiped left, go to next
      goToNext();
    } else {
      // Swiped right, go to previous
      goToPrevious();
    }
  };

  return (
    <div
      className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-xl"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel - add touch event handlers */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentIndex
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              layout="fill"
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
      </div>

      {/* Mobile layout: Button above dots */}
      <div className="md:hidden absolute bottom-0 w-full flex flex-col items-center gap-6">
        {/* Button for mobile */}
        <button
          onClick={onButtonClick}
          className="text-white font-medium text-base flex items-center gap-2 group"
        >
          <span className="border-b border-white group-hover:border-opacity-100 border-opacity-70 pb-1">
            {buttonText}
          </span>
        </button>

        {/* Indicators for mobile */}
        <div className="h-12 w-60 transform flex justify-center items-center bg-white/15 backdrop-blur-sm rounded-t-2xl px-6 py-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 mx-1 ${
                index === currentIndex
                  ? "bg-white w-6" // Make active dot wider
                  : "bg-white/50"
              }`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      </div>

      {/* Desktop layout: Button on right, dots in center */}
      <div className="absolute bottom-0 w-full h-12 md:block hidden">
        {/* Indicators for desktop */}
        <div className="absolute bottom-0 h-full w-60 left-1/2 transform -translate-x-1/2 flex justify-center items-center bg-white/15 backdrop-blur-sm rounded-t-2xl px-6 py-3 min-w-[120px]">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 mx-1 ${
                index === currentIndex ? "bg-white w-6" : "bg-white/50"
              }`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>

        {/* Button for desktop - right aligned */}
        <button
          onClick={onButtonClick}
          className="absolute top-0 right-12 text-white font-medium text-base flex items-center gap-2 group"
        >
          <span className="border-b font-medium text-xl border-white group-hover:opacity-80 border-opacity-70 pb-1">
            {buttonText}
            <ArrowUpRight
              strokeWidth={2}
              size={26}
              className="inline-flex"
            />
          </span>
        </button>
      </div>
    </div>
  );
}
