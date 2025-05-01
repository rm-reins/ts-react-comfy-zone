import { Navbar } from "@/features/navigation";
import { Outlet, useLocation } from "react-router-dom";
import { useToast } from "@/shared/ui";
import { useTranslation } from "@/i18n/useTranslation";
import { useEffect } from "react";

function HomeLayout() {
  const { logout } = useLocation().state || {};
  const { t } = useTranslation();
  const { showToast } = useToast();

  useEffect(() => {
    if (logout) {
      showToast({
        title: t("auth.signOut"),
        description: t("auth.signOutDescription"),
        variant: "success",
      });
    }
  }, [logout]);

  return (
    <>
      <Navbar />
      <div className="align-element py-10">
        <Outlet />
      </div>
    </>
  );
}
export default HomeLayout;
