import { Badge } from "@/shared/ui";

interface OrdersTableProps {
  readOnly?: boolean;
}

function OrdersTable({ readOnly = false }: OrdersTableProps) {
  return (
    <div>
      {readOnly && (
        <Badge
          variant="outline"
          className="bg-amber-100 text-amber-800 border-amber-200 mb-4"
        >
          Read-Only Mode
        </Badge>
      )}
      OrdersTable
    </div>
  );
}
export default OrdersTable;
