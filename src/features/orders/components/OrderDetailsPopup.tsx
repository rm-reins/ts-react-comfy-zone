import { useRef, useEffect } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { X } from "lucide-react";
import { Order } from "@/trpc/types";

interface OrderDetailsPopupProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

function OrderDetailsPopup({ order, isOpen, onClose }: OrderDetailsPopupProps) {
  const { t, language } = useTranslation();
  const popupRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => {
    // Map language codes to locale formats
    const localeMap: Record<string, string> = {
      en: "en-US",
      de: "de-DE",
      ru: "ru-RU",
    };

    const locale = localeMap[language] || "en-US";

    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to translate order status
  const formatStatus = (status: string) => {
    // Handle case where status might not be one of the defined statuses
    if (!status) return status;

    const statusKey = status.toLowerCase() as
      | "pending"
      | "failed"
      | "paid"
      | "delivered"
      | "cancelled";
    return t(`orders.status.${statusKey}`);
  };

  // Format currency
  const formatCurrency = (amount: number | string) => {
    // If amount is a string (like "€ 71,14"), return it directly
    if (typeof amount === "string") {
      return amount;
    }
    // Otherwise format the number
    return `€ ${amount.toFixed(2)}`.replace(".", ",");
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-600 text-white";
      case "pending":
        return "bg-yellow-600 text-white";
      case "cancelled":
      case "failed":
        return "bg-red-800 text-white";
      case "delivered":
        return "bg-green-600 text-white";
      default:
        return "bg-neutral-200 text-neutral-800";
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        ref={popupRef}
        className="bg-white dark:bg-secondary rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-secondary dark:bg-neutral-50 border-b border-neutral-200 dark:border-green-800 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">
              {t("orders.orderDetails")} #{order._id}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-neutral-600 mt-2">{formatDate(order.createdAt)}</p>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b border-neutral-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-white mb-4">
            {t("orders.orderSummary")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div>
                <p className="font-semibold text-green-800 dark:text-neutral-300 mb-1">
                  {t("orders.fulfillmentStatus")}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full capitalize text-sm ${getStatusColor(
                    order.status
                  )}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>
            </div>

            <div>
              {order.paymentId && (
                <div className="mb-4">
                  <p className="font-semibold text-green-800 dark:text-neutral-300 mb-1">
                    {t("orders.paymentId")}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {order.paymentId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6 border-b border-neutral-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-white mb-4">
            {t("orders.orderItems")}
          </h3>

          <div className="space-y-6">
            {order.orderItems?.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row border bg-neutral-50 dark:bg-neutral-100 rounded-xl p-4 border-neutral-200 dark:border-green-800"
              >
                <div className="md:w-24 h-24 rounded-xl overflow-hidden mb-4 md:mb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:ml-4 flex-grow">
                  <h4 className="font-semibold text-green-800 ">{item.name}</h4>

                  <div className="mt-2 grid grid-cols-2 gap-y-2">
                    <div>
                      <p className="text-sm text-neutral-500 ">
                        {t("orders.color")}
                      </p>
                      <p className="text-neutral-800 ">{item.color}</p>
                    </div>

                    <div>
                      <p className="text-sm text-neutral-500">
                        {t("orders.size")}
                      </p>
                      <p className="text-neutral-800">{item.size}</p>
                    </div>

                    <div>
                      <p className="text-sm text-neutral-500">
                        {t("orders.quantity")}
                      </p>
                      <p className="text-neutral-800">{item.quantity}</p>
                    </div>

                    <div>
                      <p className="text-sm text-neutral-500">
                        {t("orders.price")}
                      </p>
                      <p className="text-green-800 font-medium">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:ml-4 flex flex-col justify-between items-end">
                  <p className="text-lg font-semibold text-green-800">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Totals */}
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-neutral-600 dark:text-neutral-400">
                {t("orders.subtotal")}
              </p>
              <p className="text-neutral-800 dark:text-neutral-200">
                {formatCurrency(order.subtotal)}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-neutral-600 dark:text-neutral-400">
                {t("orders.tax")}
              </p>
              <p className="text-neutral-800 dark:text-neutral-200">
                {formatCurrency(order.tax)}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-neutral-600 dark:text-neutral-400">
                {t("orders.shipping")}
              </p>
              <p className="text-neutral-800 dark:text-neutral-200">
                {formatCurrency(order.shippingFee)}
              </p>
            </div>

            <div className="flex justify-between pt-3 border-t border-neutral-200 dark:border-green-800">
              <p className="text-lg font-semibold text-green-800 dark:text-white">
                {t("orders.total")}
              </p>
              <p className="text-lg font-semibold text-green-800 dark:text-white">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-neutral-200 dark:border-green-800    rounded-b-xl">
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 border bg-neutral-50 border-neutral-300 rounded-full text-neutral-700 hover:bg-neutral-300 transition-colors"
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPopup;
