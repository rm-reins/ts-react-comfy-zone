import {
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "./DropdownMenu";
import { ChevronLeftIcon } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

function LanguageMenuSub() {
  const { language, setLanguage, t } = useTranslation();

  const languages = [
    { code: "en" as const, label: "English" },
    { code: "de" as const, label: "Deutsch" },
    { code: "ru" as const, label: "Русский" },
  ];

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <div className="mr-auto">
          <ChevronLeftIcon />
        </div>
        {t("common.language")}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="w-32 text-right">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={language === lang.code ? "bg-muted" : ""}
            >
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
export default LanguageMenuSub;
