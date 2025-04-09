import { ProductsGrid } from "@/features/products";
import { useTranslation } from "@/i18n/useTranslation";

function Products() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {t("products.viewProducts")}
      </h1>
      <ProductsGrid />
    </div>
  );
}

export default Products;
