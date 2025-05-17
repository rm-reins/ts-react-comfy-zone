import { Order } from "@/trpc/types";
import { useEffect } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { trpc } from "@/trpc/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui";

const orderStatusFormSchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  orderStatus: z.enum(["pending", "paid", "delivered", "cancelled"]),
});

type OrderStatusFormValues = z.infer<typeof orderStatusFormSchema>;

function OrderStatusUpdateModal({
  readOnly,
  order,
  isOpen,
  onClose,
  onSuccess,
}: {
  readOnly?: boolean;
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const updateStatus = trpc.order.updateOrderStatus.useMutation();

  const STATUS = [
    { id: "pending", name: t("orders.status.pending") },
    { id: "paid", name: t("orders.status.paid") },
    { id: "delivered", name: t("orders.status.delivered") },
    { id: "cancelled", name: t("orders.status.cancelled") },
  ];

  const form = useForm<OrderStatusFormValues>({
    resolver: zodResolver(orderStatusFormSchema),
    defaultValues: {
      orderId: order?._id || "",
      orderStatus: order?.status || "pending",
    },
  });

  useEffect(() => {
    if (isOpen && order) {
      form.reset({
        orderId: order._id,
        orderStatus: order.status,
      });
    }
  }, [isOpen, order, form]);

  async function onSubmit(data: OrderStatusFormValues) {
    console.log("Form submitted:", { ...data });

    try {
      await updateStatus.mutateAsync({
        orderId: order?._id || "",
        orderStatus: data.orderStatus,
      });

      if (onSuccess) {
        await onSuccess();
      } else {
        onClose();
      }

      form.reset();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  if (!order) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("admin.ordersContent.updateStatus")}</DialogTitle>
          <DialogDescription>
            {t("admin.ordersContent.updateStatusDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="orderStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-3">
                    {t("admin.ordersContent.status")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("admin.ordersContent.selectStatus")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS.map((status) => (
                        <SelectItem
                          key={status.id}
                          value={status.id}
                        >
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                {t("common.cancel")}
              </Button>
              <Button
                disabled={readOnly}
                type="submit"
              >
                {t("common.submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { OrderStatusUpdateModal };
