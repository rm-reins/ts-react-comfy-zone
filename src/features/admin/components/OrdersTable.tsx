import { useState } from "react";
import { trpc } from "@/trpc/trpc";
import { Order } from "@/trpc/types";
import { OrderDetailsPopup } from "@/features/orders";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui";
import { useTranslation } from "@/i18n/useTranslation";

// mock orders for read-only view
import { MOCK_ORDERS } from "./mock-data";

interface OrdersTableProps {
  readOnly?: boolean;
}

function OrdersTable({ readOnly = false }: OrdersTableProps) {
  const { data: orders = [] } = trpc.order.getAllOrders.useQuery<Order[]>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const displayOrders = orders.length === 0 ? MOCK_ORDERS : orders;

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatStatus = (status: string) => {
    if (!status) return status;

    const statusKey = status.toLowerCase() as
      | "pending"
      | "failed"
      | "paid"
      | "delivered"
      | "cancelled";
    return t(`orders.status.${statusKey}`);
  };

  const filteredOrders = displayOrders.filter(
    (order) =>
      order?._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.contactInformation.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order?.contactInformation.surname
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order?.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-600 dark:bg-green-500 text-white capitalize";
      case "pending":
        return "bg-yellow-600 dark:bg-yellow-500 text-white capitalize";
      case "cancelled":
        return "bg-red-600 dark:bg-red-500 text-white capitalize";
      case "delivered":
        return "bg-green-600 dark:bg-green-500 text-white capitalize";
      default:
        return "bg-gray-200 dark:bg-green-700 text-gray-800 dark:text-gray-200 capitalize";
    }
  };

  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("admin.orders")}</CardTitle>
          {readOnly && (
            <Badge
              variant="outline"
              className="bg-amber-100 text-amber-800 border-amber-200"
            >
              {t("admin.readOnlyMode")}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder={t("admin.ordersContent.search")}
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {t("common.filter")}
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <Button
                      variant="ghost"
                      className="p-0 font-medium text-sm hover:bg-transparent"
                      onClick={() => handleSort("id")}
                    >
                      {t("admin.ordersContent.orderId")}
                      {sortField === "id" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-2 h-4 w-4 inline" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4 inline" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 font-medium text-sm hover:bg-transparent"
                      onClick={() => handleSort("customer")}
                    >
                      {t("admin.ordersContent.customer")}
                      {sortField === "customer" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-2 h-4 w-4 inline" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4 inline" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 font-medium text-sm hover:bg-transparent"
                      onClick={() => handleSort("date")}
                    >
                      {t("admin.ordersContent.date")}
                      {sortField === "date" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-2 h-4 w-4 inline" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4 inline" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 font-medium text-sm hover:bg-transparent"
                      onClick={() => handleSort("total")}
                    >
                      {t("admin.ordersContent.total")}
                      {sortField === "total" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-2 h-4 w-4 inline" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4 inline" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>{t("admin.ordersContent.status")}</TableHead>
                  <TableHead className="text-right">
                    {t("admin.ordersContent.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order._id}</TableCell>
                    <TableCell>
                      {order.contactInformation.name}{" "}
                      {order.contactInformation.surname}
                    </TableCell>
                    <TableCell>
                      {order?.createdAt instanceof Date
                        ? order.createdAt.toLocaleDateString("de-DE")
                        : new Date(order?.createdAt || 0).toLocaleDateString(
                            "de-DE"
                          )}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {order.total.toFixed(2)} €
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(order.status)}
                      >
                        {formatStatus(order.status) || ""}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleOpenOrderDetails(order as Order)
                            }
                          >
                            {t("admin.ordersContent.viewDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled={readOnly}>
                            {t("admin.ordersContent.updateStatus")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled={readOnly}>
                            {t("admin.ordersContent.printInvoice")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Popup */}
      <OrderDetailsPopup
        order={selectedOrder}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </>
  );
}
export default OrdersTable;
