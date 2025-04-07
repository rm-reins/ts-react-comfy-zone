import { useTranslation } from "@/i18n/useTranslation";

function UserOrders() {
  const { t } = useTranslation();

  const orders = [
    {
      id: "#54415",
      date: "March 12, 2023",
      paymentStatus: "Paid",
      fulfillmentStatus: "Fulfilled",
      total: "€ 71,14",
    },
    {
      id: "#46009",
      date: "October 31, 2022",
      paymentStatus: "Paid",
      fulfillmentStatus: "Fulfilled",
      total: "€ 56,92",
    },
    {
      id: "#46005",
      date: "October 31, 2022",
      paymentStatus: "Refunded",
      fulfillmentStatus: "Unfulfilled",
      total: "€ 0,00",
    },
    {
      id: "#35747",
      date: "May 18, 2022",
      paymentStatus: "Paid",
      fulfillmentStatus: "Fulfilled",
      total: "€ 36,58",
    },
    {
      id: "#54415",
      date: "March 12, 2023",
      paymentStatus: "Paid",
      fulfillmentStatus: "Fulfilled",
      total: "€ 71,14",
    },
    {
      id: "#46009",
      date: "October 31, 2022",
      paymentStatus: "Paid",
      fulfillmentStatus: "Fulfilled",
      total: "€ 56,92",
    },
    {
      id: "#46005",
      date: "October 31, 2022",
      paymentStatus: "Refunded",
      fulfillmentStatus: "Unfulfilled",
      total: "€ 0,00",
    },
    {
      id: "#35747",
      date: "May 18, 2022",
      paymentStatus: "Paid",
      fulfillmentStatus: "Fulfilled",
      total: "€ 36,58",
    },
    {
      id: "#54415",
      date: "March 12, 2023",
      paymentStatus: "Paid",
      fulfillmentStatus: "Fulfilled",
      total: "€ 71,14",
    },
    {
      id: "#46009",
      date: "October 31, 2022",
      paymentStatus: "Paid",
      fulfillmentStatus: "Fulfilled",
      total: "€ 56,92",
    },
    {
      id: "#46005",
      date: "October 31, 2022",
      paymentStatus: "Refunded",
      fulfillmentStatus: "Unfulfilled",
      total: "€ 0,00",
    },
    {
      id: "#35747",
      date: "May 18, 2022",
      paymentStatus: "Paid",
      fulfillmentStatus: "Fulfilled",
      total: "€ 36,58",
    },
  ];

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
                        {order.id}
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

              <button className="w-full mt-6 py-4 bg-primary  hover:bg-primary-light text-white font-medium rounded-full transition-colors">
                {t("orders.viewOrderDetails")}
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
export default UserOrders;
