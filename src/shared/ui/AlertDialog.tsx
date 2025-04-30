import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import Button from "./Button";
import { DeliveryAddress } from "@/trpc/types";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (address: DeliveryAddress) => void;
  address: DeliveryAddress;
}

const AlertDialog = ({
  isOpen,
  onClose,
  onDelete,
  address,
}: AlertDialogProps) => {
  if (!isOpen || !address) return null;

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
              Delete address
            </AlertDialogPrimitive.Title>
            <AlertDialogPrimitive.Description className="text-gray-600 dark:text-gray-100 mb-4">
              Are you sure you want to delete this address?
            </AlertDialogPrimitive.Description>

            <div className="flex gap-3 mt-6 justify-end">
              <AlertDialogPrimitive.Cancel asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogPrimitive.Cancel>
              <AlertDialogPrimitive.Action asChild>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(address)}
                >
                  Delete
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
