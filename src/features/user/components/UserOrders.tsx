import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { OrderDetailsPopup } from "@/features/orders";
import { Order } from "@/trpc/types";
import { trpc } from "@/trpc/trpc";

function UserOrders() {
  const { t, language } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { data, isLoading, error } = trpc.order.getCurrentUserOrders.useQuery();
  const orders = data as Order[] | undefined;
  const formatDate = (dateInput: Date | string | undefined) => {
    if (!dateInput) return "";

    const localeMap: Record<string, string> = {
      enUS: "en-US",
      deDE: "de-DE",
      ruRU: "ru-RU",
    };

    const locale = localeMap[language] || "en-US";

    const dateObj = new Date(dateInput);

    return dateObj.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to translate order status
  const formatStatus = (status: string | undefined) => {
    // Handle case where status might not be one of the defined statuses
    if (!status) return "";

    const statusKey = status.toLowerCase() as
      | "pending"
      | "failed"
      | "paid"
      | "delivered"
      | "cancelled";
    return t(`orders.status.${statusKey}`);
  };

  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-lg border border-green-100 dark:border-green-800 px-6 py-4">
          <p className="text-green-600 dark:text-green-100 font-medium">
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-8">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800 px-6 py-4">
          <p className="text-red-600 dark:text-red-400 font-medium">
            {t("common.error")}: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="flex text-2xl font-medium items-center text-gray-900 dark:text-white">
          {t("account.myOrders")}
          <span className="ml-2 bg-green-600 dark:bg-green-500 text-white rounded-full px-3 py-1 text-sm">
            {orders?.length || 0}
          </span>
        </h1>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="bg-green-50 dark:bg-green-900/20 bg-opacity-50 rounded-lg border border-green-100 dark:border-green-800 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {t("orders.noOrders")}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop View - Table */}
          <div className="hidden md:block">
            <div className="border border-green-100 dark:border-green-800 rounded-lg overflow-hidden">
              <div className="overflow-auto max-h-[500px]">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-[20%]" />
                    <col className="w-[30%]" />
                    <col className="w-[25%]" />
                    <col className="w-[25%]" />
                  </colgroup>
                  <thead className="bg-green-50 dark:bg-green-700 sticky top-0 z-10">
                    <tr>
                      <th className="py-4 px-4 font-medium text-gray-900 dark:text-white text-left">
                        {t("orders.orderId")}
                      </th>
                      <th className="py-4 px-4 font-medium text-gray-900 dark:text-white text-left">
                        {t("orders.date")}
                      </th>
                      <th className="py-4 px-4 font-medium text-gray-900 dark:text-white text-left">
                        {t("orders.fulfillmentStatus")}
                      </th>
                      <th className="py-4 px-4 font-medium text-gray-900 dark:text-white text-right">
                        {t("orders.total")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-t border-green-100 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 hover:bg-opacity-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-green-600 dark:text-green-100">
                          <button
                            onClick={() => handleOpenOrderDetails(order)}
                            className="hover:underline focus:outline-none"
                          >
                            #{order._id?.slice(0, 8)}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                          {formatStatus(order.status)}
                        </td>
                        <td className="py-4 px-4 text-green-600 dark:text-green-100 text-right font-medium">
                          {order.total} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 p-6"
              >
                <h2 className="text-xl font-medium text-green-600 dark:text-green-100 mb-4">
                  #{order._id?.slice(0, 8)}
                </h2>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      {t("orders.date")}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      {t("orders.fulfillmentStatus")}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {formatStatus(order.status)}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      {t("orders.total")}
                    </p>
                    <p className="text-green-600 dark:text-green-100 font-medium">
                      {order.total} €
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenOrderDetails(order)}
                  className="w-full mt-6 px-6 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-900/30 transition-colors font-medium"
                >
                  {t("orders.viewOrderDetails")}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Order Details Popup */}
      <OrderDetailsPopup
        order={selectedOrder}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </>
  );
}

export default UserOrders;
