import { useTranslation } from "@/i18n/useTranslation";
import { ArrowUpRight } from "lucide-react";
import { CartState } from "@/features/cart/cartSlice";

interface OrderSummaryProps {
  cart: CartState;
}

function OrderSummary({ cart }: OrderSummaryProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="border border-green-100 dark:border-green-800 bg-white dark:bg-green-900/30 rounded-lg p-4">
        <h2 className="text-base sm:text-lg font-medium mb-4 text-gray-900 dark:text-white">
          {t("checkout.orderSummary")}
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between pb-2 border-b border-green-100 dark:border-green-800">
            <span className="text-gray-600 dark:text-gray-200">
              {t("checkout.orderItems")}:
            </span>
            <span className="dark:text-white">{cart.numItemsInCart}</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-green-100 dark:border-green-800">
            <span className="text-gray-600 dark:text-gray-200">
              {t("checkout.orderAmount")}:
            </span>
            <span className="dark:text-white">{cart.cartTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-green-100 dark:border-green-800">
            <span className="text-gray-600 dark:text-gray-200">
              {t("checkout.orderShipping")}:
            </span>
            <span className="text-gray-400 dark:text-gray-200">
              {cart.shipping.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-medium">
            <span className="text-gray-900 dark:text-white">
              {t("checkout.orderSubtotal")}
            </span>
            <span className="text-gray-900 dark:text-green-100">
              {cart.orderTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-center sm:justify-end mt-10">
            <button className="flex text-lg justify-between items-center text-green-600 dark:text-green-100 font-bold border-b-2 border-green-600 dark:border-green-400 uppercase">
              {t("checkout.placeOrder")}
              <ArrowUpRight
                size={28}
                strokeWidth={2}
              />
            </button>
          </div>

          <div className="flex items-start space-x-2 mt-4">
            <input
              type="checkbox"
              required
              id="terms"
              name="terms"
              className="h-4 w-4 mt-1 text-green-600 dark:text-green-400 border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-400"
            />
            <label
              htmlFor="terms"
              className="text-gray-600 dark:text-gray-200 text-sm"
            >
              {t("checkout.acceptTerms")}
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center mt-4 space-x-2">
        <input
          type="text"
          placeholder={t("checkout.promoCode")}
          className="flex-1 p-3 mb-3 lg:mb-0 border bg-white dark:bg-green-900/20 border-green-100 dark:border-green-800 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400"
        />
        <button className="text-green-600 dark:text-green-100 font-bold uppercase flex items-center whitespace-nowrap border-b-2 border-green-600 dark:border-green-400">
          {t("common.apply")}
          <ArrowUpRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </>
  );
}

export default OrderSummary;
