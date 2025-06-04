import { Card, CardContent, CardFooter, Separator } from "@/shared/ui";
import { useTranslation } from "@/i18n/useTranslation";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui";
import { useAppSelector } from "@/store/hooks";

function OrderSummary() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cartState = useAppSelector((state) => state.cartState);

  const { cartTotal: subtotal, shipping, orderTotal: total } = cartState;

  return (
    <div className="lg:col-span-1">
      <Card className="dark:bg-green-900/20 dark:border-green-800">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {t("cart.orderSummary")}
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground dark:text-gray-300">
                {t("cart.subtotal")}
              </span>
              <span className="dark:text-white">{`${subtotal.toFixed(
                2
              )} €`}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground dark:text-gray-300">
                {t("cart.shipping")}
              </span>
              <span className="dark:text-white">{`${shipping.toFixed(
                2
              )} €`}</span>
            </div>

            <Separator className="dark:bg-green-800" />

            <div className="flex justify-between font-bold">
              <span className="dark:text-white">{t("cart.total")}</span>
              <span className="dark:text-green-100">{`${total.toFixed(
                2
              )} €`}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 p-6 pt-0">
          <button
            className="w-full h-10 justify-center rounded-xl px-6 has-[>svg]:px-4 text-lg shadow-xs bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium flex items-center uppercase"
            onClick={() => navigate("/checkout")}
          >
            {t("cart.checkout")}
            <ArrowUpRight
              size={28}
              strokeWidth={2}
            />
          </button>

          <Button
            variant="outline"
            className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-900 dark:hover:bg-green-900/30 dark:hover:text-green-100"
            onClick={() => navigate("/products")}
          >
            {t("cart.continueShopping")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
export default OrderSummary;
