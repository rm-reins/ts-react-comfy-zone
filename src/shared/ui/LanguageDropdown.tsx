import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { Languages } from "lucide-react";
import Button from "./Button";
import { useTranslation } from "@/i18n/useTranslation";

function LanguageDropdown() {
  const { language, setLanguage, t } = useTranslation();

  const languages = [
    { code: "en" as const, label: "English" },
    { code: "de" as const, label: "Deutsch" },
    { code: "ru" as const, label: "Русский" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
        >
          <Languages className="size-4" />
          <span className="sr-only">{t("common.changeLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-32"
        align="end"
        sideOffset={25}
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-muted" : ""}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LanguageDropdown;
