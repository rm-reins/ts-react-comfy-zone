import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import OrderDetailsPopup, { Order, OrderItem } from "./OrderDetailsPopup";

function UserOrders() {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Sample order items for demonstration
  const sampleOrderItems: OrderItem[] = [
    {
      name: "Modern Sofa",
      price: 899.99,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200&auto=format&fit=crop",
      quantity: 1,
      color: "Charcoal Gray",
      size: "3-Seater",
    },
    {
      name: "Dining Table Set",
      price: 649.95,
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=200&auto=format&fit=crop",
      quantity: 2,
      color: "Natural Oak",
      size: "6-Person",
    },
  ];

  const orders: Order[] = [
    {
      id: "#54415",
      date: "March 12, 2023",
      paymentStatus: "Paid",
      fulfillmentStatus: "Cancelled",
      total: "€ 71,14",
      // Additional data for the popup
      tax: 9.88,
      shippingFee: 6.95,
      subtotal: 54.31,
      orderItems: sampleOrderItems,
      status: "paid",
      paymentId: "pi_3KyW1d2eZvKYlo2C1M3fFXDR",
    },
    {
      id: "#46009",
      date: "October 31, 2022",
      paymentStatus: "Paid",
      fulfillmentStatus: "Delivered",
      total: "€ 56,92",
      // Additional data for the popup
      tax: 7.82,
      shippingFee: 4.95,
      subtotal: 44.15,
      orderItems: sampleOrderItems.slice(0, 1),
      status: "paid",
      paymentId: "pi_3JbF2s2eZvKYlo2C0N2gHx9P",
    },
    {
      id: "#46005",
      date: "October 31, 2022",
      paymentStatus: "Refunded",
      fulfillmentStatus: "Cancelled",
      total: "€ 0,00",
      // Additional data for the popup
      tax: 0,
      shippingFee: 0,
      subtotal: 0,
      orderItems: [],
      status: "cancelled",
      paymentId: "pi_3JbF1m2eZvKYlo2C1K3hGt8R",
    },
    {
      id: "#35747",
      date: "May 18, 2022",
      paymentStatus: "Paid",
      fulfillmentStatus: "Delivered",
      total: "€ 36,58",
      // Additional data for the popup
      tax: 5.32,
      shippingFee: 6.95,
      subtotal: 24.31,
      orderItems: [sampleOrderItems[1]],
      status: "delivered",
      paymentId: "pi_3GtH8j2eZvKYlo2C0L9fTr6S",
    },
    {
      id: "#54416",
      date: "March 12, 2023",
      paymentStatus: "Paid",
      fulfillmentStatus: "Delivered",
      total: "€ 71,14",
      // Additional data for the popup
      tax: 9.88,
      shippingFee: 6.95,
      subtotal: 54.31,
      orderItems: sampleOrderItems,
      status: "paid",
      paymentId: "pi_3KyW2e3fZvKYlo2C1N4gGxDS",
    },
    {
      id: "#46010",
      date: "October 31, 2022",
      paymentStatus: "Paid",
      fulfillmentStatus: "Delivered",
      total: "€ 56,92",
      // Additional data for the popup
      tax: 7.82,
      shippingFee: 4.95,
      subtotal: 44.15,
      orderItems: sampleOrderItems.slice(0, 1),
      status: "paid",
      paymentId: "pi_3JbF3t3eZvKYlo2C0O3hIy0Q",
    },
    {
      id: "#46006",
      date: "October 31, 2022",
      paymentStatus: "Refunded",
      fulfillmentStatus: "Cancelled",
      total: "€ 0,00",
      // Additional data for the popup
      tax: 0,
      shippingFee: 0,
      subtotal: 0,
      orderItems: [],
      status: "cancelled",
      paymentId: "pi_3JbF2n3eZvKYlo2C1L4iHu9S",
    },
    {
      id: "#35748",
      date: "May 18, 2022",
      paymentStatus: "Paid",
      fulfillmentStatus: "Delivered",
      total: "€ 36,58",
      // Additional data for the popup
      tax: 5.32,
      shippingFee: 6.95,
      subtotal: 24.31,
      orderItems: [sampleOrderItems[1]],
      status: "delivered",
      paymentId: "pi_3GtH9k3eZvKYlo2C0M0gUs7T",
    },
  ];

  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center mb-12">
          <h1 className="text-3xl font-bold dark:text-white text-primary">
            {t("account.myOrders")}
          </h1>
          <span className="ml-2 bg-primary text-white dark:bg-white dark:text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {orders.length}
          </span>
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block">
          <div className="border border-neutral-200 rounded-lg overflow-hidden ">
            <div className="overflow-auto max-h-[500px]">
              <table className="w-full table-fixed">
                <colgroup>
                  <col className="w-[15%]" />
                  <col className="w-[25%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
                  <col className="w-[20%]" />
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
                      {t("orders.paymentStatus")}
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
                      key={order.id}
                      className="bg-white border-t border-neutral-200 hover:bg-neutral-50 transition-colors"
                    >
                      <td className="py-4 px-4 font-semibold text-primary truncate">
                        <button
                          onClick={() => handleOpenOrderDetails(order)}
                          className="hover:no-underline underline focus:outline-none"
                        >
                          {order.id}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-neutral-600 truncate">
                        {order.date}
                      </td>
                      <td className="py-4 px-4 text-neutral-600 truncate">
                        {order.paymentStatus}
                      </td>
                      <td className="py-4 px-4 text-neutral-600 truncate">
                        {order.fulfillmentStatus}
                      </td>
                      <td className="py-4 px-4 text-primary text-right truncate">
                        {order.total}
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
              key={order.id}
              className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-primary mb-6">
                {t("orders.orderId")} {order.id}
              </h2>

              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="font-semibold text-primary mb-1">
                    {t("orders.date")}
                  </p>
                  <p className="text-neutral-600">{order.date}</p>
                </div>

                <div>
                  <p className="font-semibold text-primary mb-1">
                    {t("orders.fulfillmentStatus")}
                  </p>
                  <p className="text-neutral-600">{order.fulfillmentStatus}</p>
                </div>

                <div>
                  <p className="font-semibold text-primary mb-1">
                    {t("orders.paymentStatus")}
                  </p>
                  <p className="text-neutral-600">{order.paymentStatus}</p>
                </div>

                <div>
                  <p className="font-semibold text-primary mb-1">
                    {t("orders.total")}
                  </p>
                  <p className="text-primary">{order.total}</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenOrderDetails(order)}
                className="w-full mt-6 py-4 bg-primary hover:bg-green-700 text-white font-medium rounded-full transition-colors"
              >
                {t("orders.viewOrderDetails")}
              </button>
            </div>
          ))}
        </div>
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
