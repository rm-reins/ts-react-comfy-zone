import AdminLinksDropdown from "./AdminLinksDropdown";
import AdminNavLinks from "./AdminNavlinks";
import { UserDropdown } from "@/shared";
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
const Dashboard = () => <DashboardContent />;
const UserManagement = () => <UsersTable />;
const ProductManagement = () => <ProductsTable />;
const OrderManagement = () => <OrdersTable />;

type MenuItem = {
  id: string;
  label: string;
  component: ReactNode;
};

interface AdminNavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

function AdminNavbar({ activeView, setActiveView }: AdminNavbarProps) {
  const { t } = useTranslation();

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: t("admin.dashboard"),
      component: <Dashboard />,
    },
    {
      id: "users",
      label: t("admin.users"),
      component: <UserManagement />,
    },
    {
      id: "products",
      label: t("admin.products"),
      component: <ProductManagement />,
    },
    {
      id: "orders",
      label: t("admin.orders"),
      component: <OrderManagement />,
    },
  ];

  // Find the active component
  const activeComponent = menuItems.find(
    (item) => item.id === activeView
  )?.component;

  return (
    <div className="flex flex-col h-screen">
      <nav className="pb-2 p-3.5 md:p-1 top-0">
        <div className="align-element flex justify-between items-center">
          <Logo />
          <AdminLinksDropdown
            menuItems={menuItems}
            activeView={activeView}
            setActiveView={setActiveView}
          />
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <AdminNavLinks
              menuItems={menuItems}
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </div>
          <div className="flex justify-center items-center gap-x-4">
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
