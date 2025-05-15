import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import Button from "./Button";
import { DeliveryAddress, Product } from "@/trpc/types";
import { useTranslation } from "@/i18n/useTranslation";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (item: DeliveryAddress | Product) => void;
  address?: DeliveryAddress;
  product?: Product;
}

const AlertDialog = ({
  isOpen,
  onClose,
  onDelete,
  address,
  product,
}: AlertDialogProps) => {
  const { t, language } = useTranslation();

  if (!isOpen) return null;
  if (!address && !product) return null;

  const isAddressDialog = !!address;

  const dialogTitle = isAddressDialog
    ? t("account.deleteAddress")
    : t("admin.productsContent.deleteProduct");

  const dialogDescription = isAddressDialog
    ? t("account.confirmDeleteAddress")
    : t("admin.productsContent.deleteProductDescription", {
        productName: product?.name?.[language] || "",
      });

  const itemToDelete = address || product;

  if (!itemToDelete) return null;

  return (
    <AlertDialogPrimitive.Root
      open={isOpen}
      onOpenChange={onClose}
    >
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-50" />

        <AlertDialogPrimitive.Content className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-green-600 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <AlertDialogPrimitive.Title className="text-xl font-semibold mb-2">
              {dialogTitle}
            </AlertDialogPrimitive.Title>

            <AlertDialogPrimitive.Description className="text-gray-600 dark:text-gray-100 mb-4">
              {dialogDescription}
            </AlertDialogPrimitive.Description>

            <div className="flex gap-3 mt-6 justify-end">
              <AlertDialogPrimitive.Cancel asChild>
                <Button variant="outline">{t("common.cancel")}</Button>
              </AlertDialogPrimitive.Cancel>

              <AlertDialogPrimitive.Action asChild>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(itemToDelete)}
                >
                  {t("common.delete")}
                </Button>
              </AlertDialogPrimitive.Action>
            </div>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
};

export default AlertDialog;
