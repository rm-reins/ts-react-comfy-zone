import { useTranslation } from "@/i18n/useTranslation";
import { useState } from "react";
import { User, DeliveryAddress } from "@/trpc/types";
import AddressFormPopup from "./AddressFormPopup";
import { Button } from "@/shared/ui";
import { trpc } from "@/trpc/trpc";
import { TRPCClientError } from "@trpc/client";

function UserAddresses() {
  const { t } = useTranslation();
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<DeliveryAddress | null>(null);
  const [currentMode, setCurrentMode] = useState<"add" | "edit">("add");
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: addresses,
    refetch: refetchAddresses,
    isLoading: isAddressesLoading,
  } = trpc.user.getDeliveryAddresses.useQuery();
  const { data: user } = trpc.user.currentUser.useQuery() as {
    data: User | undefined;
  };

  const addAddressMutation = trpc.user.addDeliveryAddress.useMutation();
  const updateAddressMutation = trpc.user.updateDeliveryAddress.useMutation();
  const setDefaultAddressMutation = trpc.user.setDefaultAddress.useMutation();
  const deleteAddressMutation = trpc.user.deleteDeliveryAddress.useMutation();

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

  const handleDelete = async (address: DeliveryAddress) => {
    try {
      await deleteAddressMutation.mutateAsync({
        addressId: address._id as string,
      });

      await refetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleSetAsDefault = async (address: DeliveryAddress) => {
    try {
      setIsLoading(true);
      await setDefaultAddressMutation.mutateAsync({
        addressId: address._id as string,
      });
      await refetchAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (address: DeliveryAddress) => {
    try {
      setIsLoading(true);

      if (currentMode === "add") {
        console.log("Adding address with data:", {
          street: address.street,
          city: address.city,
          state: address.state || "",
          postalCode: address.postalCode,
          country: address.country,
          isDefault: address.isDefault || false,
        });

        await addAddressMutation.mutateAsync({
          street: address.street,
          city: address.city,
          state: address.state || "",
          postalCode: address.postalCode,
          country: address.country,
          isDefault: address.isDefault || false,
        });
      } else if (selectedAddress?._id) {
        console.log("Updating address with data:", {
          _id: selectedAddress._id,
          street: address.street,
          city: address.city,
          state: address.state || "",
          postalCode: address.postalCode,
          country: address.country,
          isDefault: address.isDefault || false,
        });

        await updateAddressMutation.mutateAsync({
          _id: selectedAddress._id,
          street: address.street,
          city: address.city,
          state: address.state || "",
          postalCode: address.postalCode,
          country: address.country,
          isDefault: address.isDefault || false,
        });
      }
      setIsAddressFormOpen(false);
      await refetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      // Show more detailed error information
      if (error instanceof TRPCClientError) {
        console.error("Error message:", error.message);
        if (error.data?.httpStatus) {
          console.error("HTTP Status:", error.data.httpStatus);
        }
        if (error.shape?.cause) {
          console.error("Cause:", error.shape.cause);
        }
        // Show user-friendly error message
        alert(`Error: ${error.message}`);
      } else {
        alert("Failed to save address");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary dark:text-white">
            {t("account.myAddresses")}
          </h1>
          <span className="ml-2 bg-primary text-white dark:bg-white dark:text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {addresses?.length}
          </span>
        </div>

        {isAddressesLoading ? (
          <div className="text-center py-8">
            <p>{t("common.loading")}</p>
          </div>
        ) : (
          <>
            {/* Desktop View - Grid */}
            <div className="hidden bg-primary-light md:grid md:grid-cols-2 gap-6">
              {addresses?.map((address, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-primary">
                      {user?.name} {user?.surname}
                    </h2>
                    {address.isDefault && (
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
                  </div>
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={() => handleEdit(address as DeliveryAddress)}
                      className="text-primary hover:text-primary-light hover:underline font-medium"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(address as DeliveryAddress)}
                      className="text-neutral-600 hover:text-primary hover:underline font-medium"
                    >
                      {t("common.delete")}
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() =>
                          handleSetAsDefault(address as DeliveryAddress)
                        }
                        className="text-neutral-600 hover:text-primary hover:underline font-medium"
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
                      {user?.name} {user?.surname}
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
                  </div>
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={() => handleEdit(address as DeliveryAddress)}
                      className="text-primary hover:text-primary-light hover:underline font-medium"
                    >
                      {t("common.edit")}
                    </button>
                    {index !== 0 && (
                      <button
                        onClick={() =>
                          handleSetAsDefault(address as DeliveryAddress)
                        }
                        className="text-neutral-600 hover:text-primary hover:underline font-medium"
                      >
                        {t("common.setAsDefault")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 text-center">
          <Button
            onClick={handleAdd}
            variant="default"
            size="xl"
          >
            {t("account.addNewAddress")}
          </Button>
        </div>
      </main>

      {/* Use the external AddressFormPopup instead of inline component */}
      <AddressFormPopup
        address={selectedAddress}
        mode={currentMode}
        isOpen={isAddressFormOpen}
        onClose={() => setIsAddressFormOpen(false)}
        onSave={(address) => handleSave(address as DeliveryAddress)}
        isSubmitting={isLoading}
      />
    </>
  );
}
export default UserAddresses;
