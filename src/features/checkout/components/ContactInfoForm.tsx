import { User } from "@/trpc/types";
import { useTranslation } from "@/i18n/useTranslation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState, useEffect, useRef } from "react";
import { setOrder } from "../checkoutSlice";

interface ContactInfoFormProps {
  user?: User;
}

function ContactInfoForm({ user }: ContactInfoFormProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const checkoutState = useSelector((state: RootState) => state.checkoutState);
  const isInitializedRef = useRef(false);

  const [contactInfo, setContactInfo] = useState({
    name: checkoutState.order.contactInformation.name || "",
    surname: checkoutState.order.contactInformation.surname || "",
    phone: checkoutState.order.contactInformation.phone || "",
    email: checkoutState.order.contactInformation.email || "",
  });

  // Initialize from checkout state or user data only on first render
  useEffect(() => {
    if (!isInitializedRef.current) {
      if (
        checkoutState.order.contactInformation.name ||
        checkoutState.order.contactInformation.surname ||
        checkoutState.order.contactInformation.email ||
        checkoutState.order.contactInformation.phone
      ) {
        // Already using Redux state from useState above, no need to update
        isInitializedRef.current = true;
        return;
      }

      // If Redux state is empty and user data is available, use the user data
      if (user) {
        const updatedContactInfo = {
          name: user.name || contactInfo.name,
          surname: user.surname || contactInfo.surname,
          phone: user.phone || contactInfo.phone,
          email: user.email || contactInfo.email,
        };

        setContactInfo(updatedContactInfo);
        updateCheckoutState(updatedContactInfo);
      }

      isInitializedRef.current = true;
    }
  }, [user, checkoutState.order.contactInformation]);

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
