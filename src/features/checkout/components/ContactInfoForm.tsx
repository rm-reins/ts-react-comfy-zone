import { useTranslation } from "@/i18n/useTranslation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useState, useEffect } from "react";
import { setOrder } from "../checkoutSlice";
import { useUser } from "@clerk/clerk-react";
import { DeliveryAddress } from "@/trpc/types";

function ContactInfoForm({ address }: { address: DeliveryAddress }) {
  const { t } = useTranslation();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const checkoutState = useAppSelector((state) => state.checkoutState);

  const [contactInfo, setContactInfo] = useState({
    name:
      checkoutState.order.contactInformation.name ||
      user?.firstName ||
      address?.firstName ||
      "",
    surname:
      checkoutState.order.contactInformation.surname ||
      user?.lastName ||
      address?.lastName ||
      "",
    phone:
      checkoutState.order.contactInformation.phone ||
      user?.primaryPhoneNumber?.phoneNumber ||
      "",
    email:
      checkoutState.order.contactInformation.email ||
      user?.primaryEmailAddress?.emailAddress ||
      "",
  });

  // Initialize from user data when it becomes available (e.g. after async loading)
  useEffect(() => {
    if (user) {
      const hasExistingData = Object.values(contactInfo).some(
        (value) => value !== ""
      );

      // Only overwrite with user data if we don't already have data in the form
      if (!hasExistingData) {
        const updatedContactInfo = {
          name: user.firstName || address.firstName || "",
          surname: user.lastName || address.lastName || "",
          phone: user.primaryPhoneNumber?.phoneNumber || "",
          email: user.primaryEmailAddress?.emailAddress || "",
        };

        setContactInfo(updatedContactInfo);
        updateCheckoutState(updatedContactInfo);
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedInfo = { ...contactInfo, [name]: value };

    setContactInfo(updatedInfo);
    updateCheckoutState(updatedInfo);
  };

  const updateCheckoutState = (data: typeof contactInfo) => {
    dispatch(
      setOrder({
        ...checkoutState.order,
        contactInformation: data,
      })
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="surname"
          value={contactInfo.surname}
          onChange={handleInputChange}
          placeholder={t("account.lastName")}
          className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
        />
        <input
          type="text"
          name="name"
          value={contactInfo.name}
          onChange={handleInputChange}
          placeholder={t("account.firstName")}
          className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
        />
      </div>
      <input
        type="tel"
        name="phone"
        value={contactInfo.phone}
        onChange={handleInputChange}
        placeholder={t("account.phone")}
        className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
      />
      <input
        type="email"
        name="email"
        value={contactInfo.email}
        onChange={handleInputChange}
        placeholder={t("account.email")}
        className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
      />
    </>
  );
}

export default ContactInfoForm;
