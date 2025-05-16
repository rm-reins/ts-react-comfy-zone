import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { OrderDetailsModal } from "@/features/orders";
import { Order } from "@/trpc/types";
import { trpc } from "@/trpc/trpc";

function UserOrders() {
  const { t, language } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortColumn, setSortColumn] = useState<"date" | "status" | "total">(
    "date"
  );

  const { data, isLoading, error } = trpc.order.getCurrentUserOrders.useQuery();
  const orders = data as Order[] | undefined;

  const sortedOrders = orders
    ? [...orders].sort((a, b) => {
        let compareValueA: string | number | Date | undefined;
        let compareValueB: string | number | Date | undefined;

        // Determine the values to compare based on sortColumn
        switch (sortColumn) {
          case "date":
            compareValueA = new Date(a.createdAt || 0).getTime();
            compareValueB = new Date(b.createdAt || 0).getTime();
            break;
          case "status":
            compareValueA = a.status?.toLowerCase() || "";
            compareValueB = b.status?.toLowerCase() || "";
            break;
          case "total":
            compareValueA = Number(a.total) || 0;
            compareValueB = Number(b.total) || 0;
            break;
        }

        // Compare based on sort direction
        if (sortDirection === "asc") {
          return compareValueA > compareValueB ? 1 : -1;
        } else {
          return compareValueA < compareValueB ? 1 : -1;
        }
      })
    : undefined;

  const handleSortChange = (column: "date" | "status" | "total") => {
    // If clicking the same column, toggle direction
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // If clicking a new column, set it as active and reset to descending (most recent/highest first)
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

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

  const renderSortIndicator = (column: "date" | "status" | "total") => {
    if (sortColumn === column) {
      return (
        <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="flex text-2xl font-medium items-center text-gray-900 dark:text-white">
          {t("account.myOrders")}
          <span className="ml-2 bg-green-600 dark:bg-green-500 text-white rounded-full px-3 py-1 text-sm">
            {sortedOrders?.length || 0}
          </span>
        </h1>
      </div>

      {!sortedOrders || sortedOrders.length === 0 ? (
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
                        <button
                          onClick={() => handleSortChange("date")}
                          className="flex items-center focus:outline-none hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          {t("orders.date")}
                          {renderSortIndicator("date")}
                        </button>
                      </th>
                      <th className="py-4 px-4 font-medium text-gray-900 dark:text-white text-left">
                        <button
                          onClick={() => handleSortChange("status")}
                          className="flex items-center focus:outline-none hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          {t("orders.fulfillmentStatus")}
                          {renderSortIndicator("status")}
                        </button>
                      </th>
                      <th className="py-4 px-4 font-medium text-gray-900 dark:text-white text-right">
                        <button
                          onClick={() => handleSortChange("total")}
                          className="flex items-center justify-end w-full focus:outline-none hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          {t("orders.total")}
                          {renderSortIndicator("total")}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOrders.map((order) => (
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
            <div className="flex justify-end mb-2">
              <select
                value={`${sortColumn}-${sortDirection}`}
                onChange={(e) => {
                  const [col, dir] = e.target.value.split("-") as [
                    "date" | "status" | "total",
                    "asc" | "desc"
                  ];
                  setSortColumn(col);
                  setSortDirection(dir);
                }}
                className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 border border-green-100 dark:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
              >
                <option value="date-desc">{t("orders.date")} (↓)</option>
                <option value="date-asc">{t("orders.date")} (↑)</option>
                <option value="status-desc">
                  {t("orders.fulfillmentStatus")} (↓)
                </option>
                <option value="status-asc">
                  {t("orders.fulfillmentStatus")} (↑)
                </option>
                <option value="total-desc">{t("orders.total")} (↓)</option>
                <option value="total-asc">{t("orders.total")} (↑)</option>
              </select>
            </div>

            {sortedOrders.map((order) => (
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
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </>
  );
}

export default UserOrders;
