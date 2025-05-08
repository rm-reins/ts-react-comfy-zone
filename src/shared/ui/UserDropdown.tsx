import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { User } from "lucide-react";
import Button from "./Button";
import LanguageMenuSub from "./LanguageMenuSub";
import { useTranslation } from "@/i18n/useTranslation";
import { NavLink, useNavigate } from "react-router-dom";
import { useClerk, useSignIn } from "@clerk/clerk-react";
import { useToast } from "@/shared/ui";
import { useAuthUser } from "@/features/auth/useAuthUser";

export default function UserDropdown() {
  const { t } = useTranslation();
  const { isSignedIn, isAdmin } = useAuthUser();
  const { showToast } = useToast();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { signIn, setActive: setSignInActive, isLoaded } = useSignIn();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/", { state: { logout: true } });
    } catch (error) {
      console.error("Error logging out:", error);
      showToast({
        title: t("common.error"),
        description:
          error instanceof Error ? error.message : t("auth.errorLogout"),
        variant: "error",
      });
    }
  };

  const handleDemoLogin = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: import.meta.env.VITE_CLERK_SIGN_IN_DEMO_USER_EMAIL,
        password: import.meta.env.VITE_CLERK_SIGN_IN_DEMO_USER_PASSWORD,
      });

      if (result.status === "complete") {
        setSignInActive({ session: result.createdSessionId });
        navigate("/");
      }

      showToast({
        title: t("auth.demoLogin"),
        description: t("auth.demoLoginDescription"),
        variant: "success",
      });
    } catch (error) {
      console.error("Error logging in as demo user:", error);
      showToast({
        title: t("common.error"),
        description:
          error instanceof Error ? error.message : t("auth.errorDemoLogin"),
        variant: "error",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
        >
          <User className="size-4" />
          <span className="sr-only">{t("common.user")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-32 text-right"
        align="end"
        sideOffset={25}
      >
        {isSignedIn ? (
          isAdmin ? (
            <>
              <DropdownMenuItem>
                <NavLink
                  className="text-foreground w-full"
                  to="/"
                >
                  {t("common.home")}
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <NavLink
                  className="text-foreground w-full"
                  to="/admin"
                >
                  {t("admin.dashboard")}
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <NavLink
                  className="text-foreground w-full"
                  to=""
                >
                  {t("common.logout")}
                </NavLink>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem>
                <NavLink
                  className="text-foreground w-full"
                  to="/profile"
                >
                  {t("common.profile")}
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <NavLink
                  className="text-foreground w-full"
                  to=""
                >
                  {t("common.logout")}
                </NavLink>
              </DropdownMenuItem>
            </>
          )
        ) : (
          <>
            <DropdownMenuItem>
              <NavLink
                className="text-foreground w-full"
                to="/sign-in"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/sign-in");
                  setTimeout(() => window.location.reload(), 50);
                }}
              >
                {t("common.login")}
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDemoLogin}>
              <span className="text-foreground w-full cursor-pointer">
                {t("auth.demoLogin")}
              </span>
            </DropdownMenuItem>
          </>
        )}

        <LanguageMenuSub />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
