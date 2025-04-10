import HeroCarousel from "./HeroCarousel";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/useTranslation";

const images = [
  {
    src: "https://res.cloudinary.com/dhts7eqoi/image/upload/v1743698187/nathan-fertig-FBXuXp57eM0-unsplash_hgz7hw.jpg",
    alt: "Sofa",
  },
  {
    src: "https://res.cloudinary.com/dhts7eqoi/image/upload/v1743698187/pickawood-Q6V5vgjmc4A-unsplash_okzz34.jpg",
    alt: "Bookcase",
  },
  {
    src: "https://res.cloudinary.com/dhts7eqoi/image/upload/v1743698187/pickawood-rwa0Yh38FeA-unsplash_uefqgi.jpg",
    alt: "Shelf",
  },
];

function Hero() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-center items-center pb-1 gap-y-4">
        <h1 className="sm:text-6xl md:text-9xl text-4xl font-bold tracking-wider">
          COMFY-ZONE
        </h1>
      </div>
      <HeroCarousel
        images={images}
        buttonText={t("products.viewProducts")}
        onButtonClick={() => {
          navigate("/products");
        }}
      />
    </>
  );
}
export default Hero;
