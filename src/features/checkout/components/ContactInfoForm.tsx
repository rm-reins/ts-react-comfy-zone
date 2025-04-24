import { User } from "@/trpc/types";
import { useTranslation } from "@/i18n/useTranslation";

interface ContactInfoFormProps {
  user?: User;
}

function ContactInfoForm({ user }: ContactInfoFormProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          defaultValue={user?.surname}
          placeholder={t("account.lastName")}
          className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
        />
        <input
          type="text"
          defaultValue={user?.name}
          placeholder={t("account.firstName")}
          className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
        />
      </div>
      <input
        type="tel"
        defaultValue={user?.phone}
        placeholder={t("account.phone")}
        className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
      />
      <input
        type="email"
        defaultValue={user?.email}
        placeholder={t("account.email")}
        className="w-full p-3 bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-green-800"
      />
    </>
  );
}

export default ContactInfoForm;
