import { useTranslation } from "@/i18n/useTranslation";
import { useState } from "react";
import { DeliveryAddress } from "@/trpc/types";
import { trpc } from "@/trpc/trpc";
import { TRPCClientError } from "@trpc/client";
import { useUser } from "@clerk/clerk-react";
import AddressFormPopup from "./AddressFormPopup";
import { Skeleton, AlertDialog, useToast } from "@/shared/ui";
import { Pencil, Trash2 } from "lucide-react";

function UserAddresses() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<DeliveryAddress | null>(null);
  const [currentMode, setCurrentMode] = useState<"add" | "edit">("add");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: addressesData,
    refetch: refetchAddresses,
    isLoading: isAddressesLoading,
  } = trpc.address.getCurrentUserAddresses.useQuery();
  const { user } = useUser();

  const addresses = addressesData as DeliveryAddress[] | undefined;

  if (!user) {
    return null;
  }

  const addAddressMutation = trpc.address.createAddress.useMutation();
  const updateAddressMutation = trpc.address.updateAddress.useMutation();
  const setDefaultAddressMutation =
    trpc.address.setDefaultAddress.useMutation();
  const deleteAddressMutation = trpc.address.deleteAddress.useMutation();

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
      await deleteAddressMutation.mutateAsync({ _id: address._id });

      setIsDeleteDialogOpen(false);
      await refetchAddresses();
      showToast({
        title: t("account.addressDeleted"),
        description: t("account.addressDeletedDescription"),
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting address:", error);
      showToast({
        title: t("common.error"),
        description:
          error instanceof Error
            ? error.message
            : t("account.errorDeletingAddress"),
        variant: "error",
      });
    }
  };

  const handleSetAsDefault = async (address: DeliveryAddress) => {
    try {
      setIsLoading(true);
      await setDefaultAddressMutation.mutateAsync({ _id: address._id });
      await refetchAddresses();
      showToast({
        title: t("account.defaultAddressUpdated"),
        description: t("account.defaultAddressUpdatedDescription"),
        variant: "success",
      });
    } catch (error) {
      console.error("Error setting default address:", error);
      showToast({
        title: t("common.error"),
        description:
          error instanceof Error
            ? error.message
            : t("account.errorSettingDefaultAddress"),
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (address: DeliveryAddress) => {
    try {
      setIsLoading(true);

      if (currentMode === "add") {
        await addAddressMutation.mutateAsync({
          firstName: address.firstName,
          lastName: address.lastName,
          street: address.street,
          city: address.city,
          state: address.state || "",
          postalCode: address.postalCode,
          country: address.country,
          clerkId: user.id,
          isDefault: address.isDefault || false,
        });

        showToast({
          title: t("account.addressAdded"),
          description: t("account.addressAddedDescription"),
          variant: "success",
        });
      } else if (selectedAddress?._id) {
        await updateAddressMutation.mutateAsync({
          _id: selectedAddress._id,
          firstName: address.firstName,
          lastName: address.lastName,
          street: address.street,
          city: address.city,
          state: address.state || "",
          postalCode: address.postalCode,
          country: address.country,
          clerkId: user.id,
          isDefault: address.isDefault || false,
        });

        showToast({
          title: t("account.addressUpdated"),
          description: t("account.addressUpdatedDescription"),
          variant: "success",
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
        showToast({
          title: t("common.error"),
          description: error.message,
          variant: "error",
        });
      } else {
        showToast({
          title: t("common.error"),
          description: t("account.errorSavingAddress"),
          variant: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="flex text-2xl font-medium items-center text-gray-900 dark:text-white">
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
            {addresses?.map((address: DeliveryAddress, index) => (
              <div
                key={index}
                className="bg-white dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                    {address?.firstName} {address?.lastName}
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
                    className="text-green-600 dark:text-green-100 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md p-2 dark:hover:text-white font-medium transition-colors"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAddress(address as DeliveryAddress);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="text-red-600 dark:text-red-100 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md p-2 dark:hover:text-white font-medium transition-colors"
                  >
                    <Trash2 />
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() =>
                        handleSetAsDefault(address as DeliveryAddress)
                      }
                      className="text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md p-2 dark:hover:text-white font-medium transition-colors"
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
                    {user?.firstName} {user?.lastName}
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
                    className="text-green-600 dark:text-green-100 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md p-2 dark:hover:text-white font-medium transition-colors"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAddress(address as DeliveryAddress);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="text-red-600 dark:text-red-100 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md p-2 dark:hover:text-white font-medium transition-colors"
                  >
                    <Trash2 />
                  </button>

                  {!address.isDefault && (
                    <button
                      onClick={() =>
                        handleSetAsDefault(address as DeliveryAddress)
                      }
                      className="text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md p-2 dark:hover:text-white font-medium transition-colors"
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

      {/* Delete Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={() => handleDelete(selectedAddress as DeliveryAddress)}
        address={selectedAddress as DeliveryAddress}
      />

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
