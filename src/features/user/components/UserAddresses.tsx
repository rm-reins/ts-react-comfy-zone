import { useTranslation } from "@/i18n/useTranslation";
import { useState } from "react";
import { User, DeliveryAddress } from "@/trpc/types";
import AddressFormPopup from "./AddressFormPopup";
import { Skeleton } from "@/shared/ui";
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
          {t("account.myAddresses")}
          <span className="ml-2 bg-green-600 dark:bg-green-500 text-white rounded-full px-3 py-1 text-sm">
            {addresses?.length || 0}
          </span>
        </h1>
      </div>

      {isAddressesLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-lg border border-green-100 dark:border-green-800 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="mt-6 flex gap-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Desktop View - Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {addresses?.map((address, index) => (
              <div
                key={index}
                className="bg-white dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                    {user?.name} {user?.surname}
                  </h2>
                  {address.isDefault && (
                    <span className="bg-green-50 dark:bg-green-800 text-green-600 dark:text-green-100 px-3 py-1 rounded-full text-sm font-medium">
                      {t("common.default")}
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => handleEdit(address as DeliveryAddress)}
                    className="text-green-600 dark:text-green-100 hover:text-green-700 dark:hover:text-white font-medium transition-colors hover:underline"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(address as DeliveryAddress)}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
                  >
                    {t("common.delete")}
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() =>
                        handleSetAsDefault(address as DeliveryAddress)
                      }
                      className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-100 font-medium transition-colors hover:underline"
                    >
                      {t("common.setAsDefault")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-4">
            {addresses?.map((address, index) => (
              <div
                key={index}
                className="bg-white dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                    {user?.name} {user?.surname}
                  </h2>
                  {address.isDefault && (
                    <span className="bg-green-50 dark:bg-green-800 text-green-600 dark:text-green-100 px-3 py-1 rounded-full text-sm font-medium">
                      {t("common.default")}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => handleEdit(address as DeliveryAddress)}
                    className="text-green-600 dark:text-green-100 hover:text-green-700 dark:hover:text-white font-medium transition-colors"
                  >
                    {t("common.edit")}
                  </button>

                  {!address.isDefault && (
                    <button
                      onClick={() =>
                        handleSetAsDefault(address as DeliveryAddress)
                      }
                      className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-100 font-medium transition-colors"
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

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleAdd}
          className="px-6 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-900/30 transition-colors font-medium"
        >
          {t("account.addNewAddress")}
        </button>
      </div>

      {/* Address Form Popup */}
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
