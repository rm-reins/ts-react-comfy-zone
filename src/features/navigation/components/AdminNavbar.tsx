import AdminLinksDropdown from "./AdminLinksDropdown";
import AdminNavLinks from "./AdminNavlinks";
import UserDropdown from "./UserDropdown";
import { useTranslation } from "@/i18n/useTranslation";
import { Logo, ModeToggle, CartButton } from "@/shared";
import { ReactNode } from "react";
import {
  DashboardContent,
  UsersTable,
  ProductsTable,
  OrdersTable,
} from "@/features/admin";

// Placeholder components - replace with your actual imports
const Dashboard = ({ readOnly }: { readOnly?: boolean }) => (
  <DashboardContent readOnly={readOnly} />
);
const UserManagement = ({ readOnly }: { readOnly?: boolean }) => (
  <UsersTable readOnly={readOnly} />
);
const ProductManagement = ({ readOnly }: { readOnly?: boolean }) => (
  <ProductsTable readOnly={readOnly} />
);
const OrderManagement = ({ readOnly }: { readOnly?: boolean }) => (
  <OrdersTable readOnly={readOnly} />
);

type MenuItem = {
  id: string;
  label: string;
  component: ReactNode;
};

interface AdminNavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  readOnly?: boolean;
}

function AdminNavbar({
  activeView,
  setActiveView,
  readOnly = false,
}: AdminNavbarProps) {
  const { t } = useTranslation();

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: t("admin.dashboard"),
      component: <Dashboard readOnly={readOnly} />,
    },
    {
      id: "users",
      label: t("admin.users"),
      component: <UserManagement readOnly={readOnly} />,
    },
    {
      id: "products",
      label: t("admin.products"),
      component: <ProductManagement readOnly={readOnly} />,
    },
    {
      id: "orders",
      label: t("admin.orders"),
      component: <OrderManagement readOnly={readOnly} />,
    },
  ];

  // Find the active component
  const activeComponent = menuItems.find(
    (item) => item.id === activeView
  )?.component;

  return (
    <div className="flex flex-col h-screen">
      <nav className="pb-2 p-3.5 md:p-1 top-0">
        <div className="align-element flex justify-between items-center gap-x-4">
          <Logo />
          <AdminLinksDropdown
            menuItems={menuItems}
            activeView={activeView}
            setActiveView={setActiveView}
          />
          <div className="flex-1 min-w-0 flex justify-center">
            <AdminNavLinks
              menuItems={menuItems}
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </div>
          <div className="flex items-center gap-x-4 flex-shrink-0">
            <ModeToggle />
            <CartButton />
            <UserDropdown />
          </div>
        </div>
      </nav>

      {/* Content area for rendering the active component */}
      <main className="flex-1 overflow-auto p-4">{activeComponent}</main>
    </div>
  );
}
export default AdminNavbar;
