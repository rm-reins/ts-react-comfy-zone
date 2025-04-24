import { useTranslation } from "@/i18n/useTranslation";

function AdditionalInfoForm() {
  const { t } = useTranslation();

  return (
    <textarea
      placeholder={t("checkout.additionalInfoPlaceholder")}
      rows={4}
      className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
    />
  );
}

export default AdditionalInfoForm;
