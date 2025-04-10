import { useState, useRef, useEffect } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard = ({ title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm min-w-30 max-w-60 md:max-w-none md:min-w-0 flex-shrink-0 md:flex-shrink-1 w-[85vw] md:w-auto mx-2 md:mx-0">
      <h3 className="text-gray-800 font-medium text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
};

export default function FeaturesSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const features = [
    {
      title: "Premium Craftsmanship",
      description:
        "Our furniture is crafted from carefully selected materials, ensuring exceptional durability and lasting quality in every piece",
    },
    {
      title: "Timeless Design",
      description:
        "Our collections blend contemporary aesthetics with classic elegance, creating pieces that remain stylish for generations",
    },
    {
      title: "Sustainable Living",
      description:
        "We source eco-friendly materials and practice responsible manufacturing because we believe in sustainable home furnishings",
    },
    {
      title: "Customizable Options",
      description:
        "With a wide range of styles, finishes, and configurations, you can find the perfect furniture to match your space",
    },
    {
      title: "Ergonomic Comfort",
      description:
        "Every piece is designed with ergonomics in mind, ensuring maximum comfort and functionality for your daily life",
    },
    {
      title: "Expert Service",
      description:
        "Our dedicated team provides personalized assistance to help you find the perfect furniture solutions for your home",
    },
  ];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollWidth =
        scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (scrollWidth > 0) {
        const progress = scrollContainer.scrollLeft / scrollWidth;
        setScrollProgress(progress);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);

    // Change cursor to indicate dragging
    document.body.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    document.body.style.cursor = "default";
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = "default";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    // Prevent default behavior (like text selection) while dragging
    e.preventDefault();

    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="bg-secondary rounded-b-xl py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile view with horizontal scroll */}
        <div className="md:hidden">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="snap-center"
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>

          {/* Progress scrollbar */}
          <div className="h-1 bg-white rounded-full mt-4 mx-4">
            <div
              className="h-1 bg-green-800 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Desktop view with staggered grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                       ${index % 2 === 0 ? "md:mt-0" : "md:mt-12"}
                       ${
                         index % 3 === 0
                           ? "lg:mt-0"
                           : index % 3 === 1
                           ? "lg:mt-16"
                           : "lg:mt-8"
                       }
                     `}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
