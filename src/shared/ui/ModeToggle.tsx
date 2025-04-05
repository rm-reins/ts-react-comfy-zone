import { Moon, Sun } from "lucide-react";
import Button from "./Button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setTheme } from "@/features/theme/themeSlice";
import type { Theme } from "@/features/theme/themeSlice";
import { useTranslation } from "@/i18n/useTranslation";

function ModeToggle() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.themeState);
  const { t } = useTranslation();

  const handleThemeChange = (newTheme: Theme) => {
    dispatch(setTheme(newTheme));
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="shadow-none border-none"
      onClick={() =>
        theme === "light"
          ? handleThemeChange("dark")
          : handleThemeChange("light")
      }
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{t("common.toggleTheme")}</span>
    </Button>
  );
}
export default ModeToggle;
