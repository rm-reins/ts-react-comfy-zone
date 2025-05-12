import { AdminNavbar } from "@/features/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { useState } from "react";

type ActiveView = "dashboard" | "users" | "products" | "orders";

interface AdminPageProps {
  readOnly?: boolean;
}

function AdminPage({ readOnly = false }: AdminPageProps) {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      {readOnly && (
        <div className="bg-amber-100 text-amber-800 p-2 text-center text-sm">
          {t("admin.readOnlyHeader")}
        </div>
      )}
      <AdminNavbar
        activeView={activeView}
        setActiveView={(view) => setActiveView(view as ActiveView)}
        readOnly={readOnly}
      />
    </div>
  );
}
export default AdminPage;
