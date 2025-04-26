import { useTranslation } from "@/i18n/useTranslation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState, useEffect, useRef } from "react";
import { setOrder } from "../checkoutSlice";

function AdditionalInfoForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const checkoutState = useSelector((state: RootState) => state.checkoutState);
  const isInitializedRef = useRef(false);

  const [additionalInfo, setAdditionalInfo] = useState(
    checkoutState.order.additionalInformation || ""
  );

  useEffect(() => {
    if (!isInitializedRef.current) {
      if (checkoutState.order.additionalInformation !== undefined) {
        setAdditionalInfo(checkoutState.order.additionalInformation || "");
      }
      isInitializedRef.current = true;
    }
  }, [checkoutState.order.additionalInformation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAdditionalInfo(value);

    dispatch(
      setOrder({
        ...checkoutState.order,
        additionalInformation: value,
      })
    );
  };

  return (
    <textarea
      value={additionalInfo}
      onChange={handleInputChange}
      placeholder={t("checkout.additionalInfoPlaceholder")}
      rows={4}
      className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
    />
  );
}

export default AdditionalInfoForm;
