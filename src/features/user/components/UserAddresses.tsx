import { useTranslation } from "@/i18n/useTranslation";
import { useState } from "react";
import { User, DeliveryAddress } from "@/trpc/types";
import AddressFormPopup from "./AddressFormPopup";

function UserAddresses() {
  const { t } = useTranslation();
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<DeliveryAddress | null>(null);
  const [currentMode, setCurrentMode] = useState<"add" | "edit">("add");

  const handleEdit = (address: DeliveryAddress) => {
    setSelectedAddress(address);
    setCurrentMode("edit");
    setIsAddressFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedAddress(null);
    setCurrentMode("add");
    setIsAddressFormOpen(true);
  };

  const handleSetAsDefault = (address: DeliveryAddress) => {
    console.log("Set as default:", address);
    // Here you would update the address as default in your database
  };

  const handleSave = (address: DeliveryAddress) => {
    console.log("Address saved:", address);
    setIsAddressFormOpen(false);
    // Here you would save the address to your database
  };

  // Mock user data with delivery addresses
  const user: User = {
    _id: "1",
    name: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    role: "user",
    phone: "+1 555-123-4567",
    deliveryAddresses: [
      {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States",
        _id: "1",
        isDefault: true,
      },
      {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90001",
        country: "United States",
        _id: "2",
        isDefault: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Combine the user's delivery address and additional addresses for display
  const addresses = user.deliveryAddresses;

  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center mb-12">
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            {t("account.myAddresses")}
          </h1>
          <span className="ml-2 bg-primary text-white dark:bg-white dark:text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {addresses?.length}
          </span>
        </div>

        {/* Desktop View - Grid */}
        <div className="hidden bg-primary-light md:grid md:grid-cols-2 gap-6">
          {addresses?.map((address, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-primary">
                  {user.name} {user.surname}
                </h2>
                {index === 0 && (
                  <span className="bg-primary-light text-primary text-m px-2 py-1 rounded-full">
                    {t("common.default")}
                  </span>
                )}
              </div>
              <div className="space-y-2 text-neutral-600">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
                <p>{user.phone}</p>
              </div>
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => handleEdit(address)}
                  className="text-primary hover:text-primary-light font-medium"
                >
                  {t("common.edit")}
                </button>
                {index !== 0 && (
                  <button
                    onClick={() => handleSetAsDefault(address)}
                    className="text-neutral-600 hover:text-primary font-medium"
                  >
                    {t("common.setAsDefault")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-6">
          {addresses?.map((address, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-primary">
                  {user.name} {user.surname}
                </h2>
                {index === 0 && (
                  <span className="bg-primary-light text-white text-xs px-2 py-1 rounded-full">
                    {t("common.default")}
                  </span>
                )}
              </div>
              <div className="space-y-2 text-neutral-600">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
                <p>{user.phone}</p>
              </div>
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => handleEdit(address)}
                  className="text-primary hover:text-primary-light font-medium"
                >
                  {t("common.edit")}
                </button>
                {index !== 0 && (
                  <button
                    onClick={() => handleSetAsDefault(address)}
                    className="text-neutral-600 hover:text-primary font-medium"
                  >
                    {t("common.setAsDefault")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleAdd}
            className="bg-primary hover:bg-primary-light dark:bg-white dark:text-primary text-white font-medium py-3 px-6 rounded-full transition-colors"
          >
            {t("account.addNewAddress")}
          </button>
        </div>
      </main>

      {/* Use the external AddressFormPopup instead of inline component */}
      <AddressFormPopup
        address={selectedAddress}
        mode={currentMode}
        isOpen={isAddressFormOpen}
        onClose={() => setIsAddressFormOpen(false)}
        onSave={(address) => handleSave(address as DeliveryAddress)}
      />
    </>
  );
}
export default UserAddresses;
