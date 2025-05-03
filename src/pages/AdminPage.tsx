import { AdminNavbar } from "@/features/navigation";
import { useState } from "react";

type ActiveView = "dashboard" | "users" | "products" | "orders";

function AdminPage() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");

  return (
    <div className="min-h-screen">
      <AdminNavbar
        activeView={activeView}
        setActiveView={(view) => setActiveView(view as ActiveView)}
      />
    </div>
  );
}
export default AdminPage;
