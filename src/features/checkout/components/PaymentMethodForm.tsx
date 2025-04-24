import { useTranslation } from "@/i18n/useTranslation";

function PaymentMethodForm() {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="creditCard"
            name="paymentMethod"
            className="h-4 w-4 text-green-600 dark:text-green-400 border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-400"
          />
          <label
            htmlFor="creditCard"
            className="text-gray-600 dark:text-gray-200"
          >
            {t("checkout.creditCard")}
          </label>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="paypal"
            name="paymentMethod"
            className="h-4 w-4 text-green-600 dark:text-green-400 border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-400"
          />
          <label
            htmlFor="paypal"
            className="text-gray-600 dark:text-gray-200"
          >
            {t("checkout.paypal")}
          </label>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="bankTransfer"
            name="paymentMethod"
            className="h-4 w-4 text-green-600 dark:text-green-400 border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-400"
          />
          <label
            htmlFor="bankTransfer"
            className="text-gray-600 dark:text-gray-200"
          >
            {t("checkout.bankTransfer")}
          </label>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300 italic">
        {t("checkout.paymentInfoText")}
      </p>
    </>
  );
}

export default PaymentMethodForm;
