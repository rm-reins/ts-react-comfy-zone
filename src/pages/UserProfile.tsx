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
    <div className="min-h-screen/2 bg-secondary rounded-xl">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm px-4 py-4 rounded-t-xl border ">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <div className="flex space-x-12">
            <button
              onClick={() => handleClick("orders")}
              className={`font-medium pb-1  ${
                activeTab === "orders"
                  ? "text-primary border-b-2 border-primary"
                  : "text-neutral-600 hover:text-primary"
              }`}
            >
              {t("account.myOrders")}
            </button>
            <button
              onClick={() => handleClick("addresses")}
              className={`font-medium pb-1 ${
                activeTab === "addresses"
                  ? "text-primary border-b-2 border-primary"
                  : "text-neutral-600 hover:text-primary"
              }`}
            >
              {t("account.myAddresses")}
            </button>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {activeTab === "orders" ? <UserOrders /> : <UserAddresses />}
      </main>
    </div>
  );
}

export default UserProfile;
