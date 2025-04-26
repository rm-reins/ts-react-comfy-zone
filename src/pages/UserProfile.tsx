import { UserOrders, UserAddresses } from "@/features/user";
import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";

function UserProfile() {
  const [activeTab, setActiveTab] = useState<"orders" | "addresses">("orders");
  const { t } = useTranslation();

  const handleClick = (tab: "orders" | "addresses") => {
    setActiveTab(tab);
  };

  return (
    <div className="h-fit bg-white dark:bg-green-600 p-4 md:p-8 rounded-xl">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <div className="bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-xl border border-green-100 dark:border-green-800 mb-6">
          <nav className="px-4 py-4">
            <div className="flex justify-center items-center">
              <div className="flex space-x-12">
                <button
                  onClick={() => handleClick("orders")}
                  className={`font-medium pb-1 transition-colors ${
                    activeTab === "orders"
                      ? "text-green-600 dark:text-white border-b-2 border-green-600 dark:border-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-white"
                  }`}
                >
                  {t("account.myOrders")}
                </button>
                <button
                  onClick={() => handleClick("addresses")}
                  className={`font-medium pb-1 transition-colors ${
                    activeTab === "addresses"
                      ? "text-green-600 dark:text-white border-b-2 border-green-600 dark:border-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-white"
                  }`}
                >
                  {t("account.myAddresses")}
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 p-6">
          {activeTab === "orders" ? <UserOrders /> : <UserAddresses />}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
