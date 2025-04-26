import { DeliveryAddress } from "@/trpc/types";
import { useTranslation } from "@/i18n/useTranslation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState, useEffect, useRef } from "react";
import { setOrder } from "../checkoutSlice";

interface ShippingAddressFormProps {
  defaultAddress?: DeliveryAddress;
}

function ShippingAddressForm({ defaultAddress }: ShippingAddressFormProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const checkoutState = useSelector((state: RootState) => state.checkoutState);
  const isInitializedRef = useRef(false);

  const [address, setAddress] = useState({
    street: checkoutState.order.deliveryAddress.street || "",
    city: checkoutState.order.deliveryAddress.city || "",
    state: checkoutState.order.deliveryAddress.state || "",
    postalCode: checkoutState.order.deliveryAddress.postalCode || "",
    country: checkoutState.order.deliveryAddress.country || "",
  });

  useEffect(() => {
    if (!isInitializedRef.current) {
      if (
        checkoutState.order.deliveryAddress.street ||
        checkoutState.order.deliveryAddress.city ||
        checkoutState.order.deliveryAddress.postalCode ||
        checkoutState.order.deliveryAddress.country
      ) {
        isInitializedRef.current = true;
        return;
      }

      if (defaultAddress) {
        const updatedAddress = {
          street: defaultAddress.street || address.street,
          city: defaultAddress.city || address.city,
          state: defaultAddress.state || address.state,
          postalCode: defaultAddress.postalCode || address.postalCode,
          country: defaultAddress.country || address.country,
        };

        setAddress(updatedAddress);
        updateCheckoutState(updatedAddress);
      }

      isInitializedRef.current = true;
    }
  }, [defaultAddress, checkoutState.order.deliveryAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedAddress = { ...address, [name]: value };

    setAddress(updatedAddress);
    updateCheckoutState(updatedAddress);
  };

  const updateCheckoutState = (data: typeof address) => {
    dispatch(
      setOrder({
        ...checkoutState.order,
        deliveryAddress: data,
      })
    );
  };

  return (
    <>
      <input
        type="text"
        required
        name="street"
        defaultValue={address.street}
        onChange={handleInputChange}
        placeholder={t("account.address")}
        className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
      />
      <input
        type="text"
        required
        name="city"
        defaultValue={address.city}
        onChange={handleInputChange}
        placeholder={t("account.city")}
        className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          required
          name="state"
          defaultValue={address.state}
          onChange={handleInputChange}
          placeholder={t("account.state")}
          className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
        />
        <input
          type="text"
          required
          name="postalCode"
          defaultValue={address.postalCode}
          onChange={handleInputChange}
          placeholder={t("account.zipCode")}
          className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
        />
      </div>
      <input
        type="text"
        required
        name="country"
        defaultValue={address.country}
        onChange={handleInputChange}
        placeholder={t("account.country")}
        className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
      />
    </>
  );
}

export default ShippingAddressForm;
