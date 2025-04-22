import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { OrderDetailsPopup } from "@/features/orders";
import { Order } from "@/trpc/types";
import { trpc } from "@/trpc/trpc";
import { Button } from "@/shared/ui";

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
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <p className="text-xl font-medium">{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <p className="text-lg font-medium text-red-600">
          {t("common.error")}: {error.message}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white text-primary">
            {t("account.myOrders")}
          </h1>
          <span className="ml-2 bg-primary text-white dark:bg-white dark:text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {orders?.length || 0}
          </span>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-2xl text-neutral-600">{t("orders.noOrders")}</p>
          </div>
        ) : (
          <>
            {/* Desktop View - Table */}
            <div className="hidden md:block">
              <div className="border border-neutral-200 rounded-xl overflow-hidden ">
                <div className="overflow-auto max-h-[500px]">
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col className="w-[20%]" />
                      <col className="w-[30%]" />
                      <col className="w-[25%]" />
                      <col className="w-[25%]" />
                    </colgroup>
                    <thead className="bg-neutral-50 sticky top-0 z-10">
                      <tr>
                        <th className="py-4 px-4 font-semibold text-primary text-left">
                          {t("orders.orderId")}
                        </th>
                        <th className="py-4 px-4 font-semibold text-primary text-left">
                          {t("orders.date")}
                        </th>
                        <th className="py-4 px-4 font-semibold text-primary text-left">
                          {t("orders.fulfillmentStatus")}
                        </th>
                        <th className="py-4 px-4 font-semibold text-primary text-right">
                          {t("orders.total")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order._id}
                          className="bg-white border-t border-neutral-200 hover:bg-neutral-50 transition-colors"
                        >
                          <td className="py-4 px-4 font-semibold text-primary truncate">
                            <button
                              onClick={() => handleOpenOrderDetails(order)}
                              className="hover:no-underline underline focus:outline-none"
                            >
                              #{order._id?.slice(0, 8)}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-neutral-600 truncate">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="py-4 px-4 text-neutral-600 truncate">
                            {formatStatus(order.status)}
                          </td>
                          <td className="py-4 px-4 text-primary text-right truncate">
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
            <div className="md:hidden space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-primary mb-6">
                    {t("orders.orderId")} #{order._id?.slice(0, 8)}
                  </h2>

                  <div className="grid grid-cols-2 gap-y-6">
                    <div>
                      <p className="font-semibold text-primary mb-1">
                        {t("orders.date")}
                      </p>
                      <p className="text-neutral-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-primary mb-1">
                        {t("orders.fulfillmentStatus")}
                      </p>
                      <p className="text-neutral-600">
                        {formatStatus(order.status)}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-primary mb-1">
                        {t("orders.total")}
                      </p>
                      <p className="text-primary">{order.total} €</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleOpenOrderDetails(order)}
                    variant="default"
                    className="w-full mt-6"
                  >
                    {t("orders.viewOrderDetails")}
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

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
