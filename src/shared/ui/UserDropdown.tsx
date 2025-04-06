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
import { useUser, useClerk } from "@clerk/clerk-react";

export default function UserDropdown() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
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
        {user ? (
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
        ) : (
          <DropdownMenuItem>
            <NavLink
              className="text-foreground w-full"
              to="/sign-in"
            >
              {t("common.login")}
            </NavLink>
          </DropdownMenuItem>
        )}
        <LanguageMenuSub />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
