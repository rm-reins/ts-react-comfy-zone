import { DeliveryAddress } from "@/trpc/types";
import { useTranslation } from "@/i18n/useTranslation";

interface ShippingAddressFormProps {
  defaultAddress?: DeliveryAddress;
}

function ShippingAddressForm({ defaultAddress }: ShippingAddressFormProps) {
  const { t } = useTranslation();

  return (
    <>
      <input
        type="text"
        required
        defaultValue={defaultAddress?.street}
        placeholder={t("account.address")}
        className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
      />
      <input
        type="text"
        required
        defaultValue={defaultAddress?.city}
        placeholder={t("account.city")}
        className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          required
          defaultValue={defaultAddress?.state}
          placeholder={t("account.state")}
          className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
        />
        <input
          type="text"
          required
          defaultValue={defaultAddress?.postalCode}
          placeholder={t("account.zipCode")}
          className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
        />
      </div>
      <input
        type="text"
        required
        defaultValue={defaultAddress?.country}
        placeholder={t("account.country")}
        className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
      />
    </>
  );
}

export default ShippingAddressForm;
