import { FeaturedProducts } from "@/features/products";
import { Hero } from "@/features/home";
import { FeaturesSection } from "@/shared/ui";

function Landing() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <FeaturedProducts />
    </>
  );
}
export default Landing;
