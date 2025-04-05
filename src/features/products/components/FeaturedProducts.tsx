import { useTranslation } from "@/i18n/useTranslation";

function FeaturedProducts() {
  const { t } = useTranslation();

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        {t("products.featured")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {/* Product cards will go here */}
        <div className="p-4 border rounded-lg shadow-sm">
          <div className="h-48 bg-muted rounded-md mb-4"></div>
          <h3 className="text-xl font-semibold">{t("products.comingSoon")}</h3>
          <p className="text-muted-foreground">
            {t("products.checkBackLater")}
          </p>
        </div>
      </div>
    </div>
  );
}
export default FeaturedProducts;
