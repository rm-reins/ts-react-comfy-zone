import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Product } from "@/trpc/types";
import { useTranslation } from "@/i18n/useTranslation";

interface ProductAccordionProps {
  product: Product;
}

function ProductAccordion({ product }: ProductAccordionProps) {
  const { t, language } = useTranslation();
  const [openSection, setOpenSection] = useState<string>("description");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  const productDescription = product.description[language];

  return (
    <div className="space-y-3 text-primary">
      <div className="p-4 bg-white text-gray-600 rounded-xl">
        <p>{productDescription}</p>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <button
          className="w-full flex justify-between items-center p-4 bg-white"
          onClick={() => toggleSection("details")}
        >
          <span className="font-medium uppercase">
            {t("products.productDetails")}
          </span>
          {openSection === "details" ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {openSection === "details" && (
          <div className="p-4 bg-white text-gray-600">
            <p className="capitalize">
              {t("products.category")}:{" "}
              {t(`products.categoryType.${product.category}`)}
            </p>
            <p>
              {t("products.company")}: {product.company}
            </p>
          </div>
        )}
      </div>

      <div className="border rounded-xl overflow-hidden">
        <button
          className="w-full flex justify-between items-center p-4 bg-white"
          onClick={() => toggleSection("shipping")}
        >
          <span className="font-medium uppercase">
            {t("products.shippingAndReturns")}
          </span>
          {openSection === "shipping" ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {openSection === "shipping" && (
          <div className="p-4 bg-white text-gray-600">
            <p>{t("products.shippingTerms")}</p>
            <p>{t("products.shippingReturns")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductAccordion;
