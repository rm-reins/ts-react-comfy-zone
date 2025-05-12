import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
} from "@/shared/ui";
import { SalesChart } from "./SalesChart";
import { useTranslation } from "@/i18n/useTranslation";

interface DashboardContentProps {
  readOnly?: boolean;
}

function DashboardContent({ readOnly = false }: DashboardContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {readOnly && (
        <Card className="border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Badge
                variant="outline"
                className="bg-amber-100 text-amber-800 border-amber-200 mr-2"
              >
                {t("admin.readOnlyMode")}
              </Badge>
              <span className="text-amber-800">
                {t("admin.readOnlyModeDescription")}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.dashboardContent.totalRevenue")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231.89 €</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                +20.1%
              </span>{" "}
              {t("admin.dashboardContent.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.dashboardContent.newCustomers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                +18.2%
              </span>{" "}
              {t("admin.dashboardContent.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.dashboardContent.totalProducts")}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                +4.3%
              </span>{" "}
              {t("admin.dashboardContent.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.dashboardContent.activeOrders")}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                <ArrowDown className="mr-1 h-4 w-4" />
                -2.5%
              </span>{" "}
              {t("admin.dashboardContent.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("admin.dashboardContent.salesOverview")}</CardTitle>
            <CardDescription>
              {t("admin.dashboardContent.salesDataInfo")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default DashboardContent;
