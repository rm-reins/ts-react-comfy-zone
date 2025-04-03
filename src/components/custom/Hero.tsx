import HeroCarousel from "./HeroCarousel";
import { useNavigate } from "react-router-dom";

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
  return (
    <HeroCarousel
      images={images}
      buttonText={"View Products"}
      onButtonClick={() => {
        navigate("/products");
      }}
    />
  );
}
export default Hero;
