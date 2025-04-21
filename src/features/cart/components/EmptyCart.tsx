import { ShoppingBag } from "lucide-react";
import { Button } from "@/shared/ui";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/useTranslation";

export default function EmptyCart() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="container px-4 py-16 mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2">{t("cart.empty")}</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {t("cart.emptyMessage")}
      </p>
      <Button
        size="lg"
        onClick={() => navigate("/products")}
      >
        {t("cart.startShopping")}
      </Button>
    </div>
  );
}
