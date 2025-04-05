import { Link } from "react-router-dom";
import { Button } from "@/shared/ui";
import { useTranslation } from "@/i18n/useTranslation";

function Cart() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-4xl">{t("cart.title")}</h1>
      <Link
        to="/"
        className="text-7xl text-red-900"
      >
        {t("common.backToHome")}
      </Link>
      <Button
        asChild
        size="lg"
      >
        <Link to="/products">{t("products.viewProducts")}</Link>
      </Button>
    </div>
  );
}
export default Cart;
