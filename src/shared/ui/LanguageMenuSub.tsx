import {
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "./DropdownMenu";
import { ChevronDownIcon } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

function LanguageMenuSub() {
  const { language, setLanguage, t } = useTranslation();

  const languages = [
    { code: "enUS" as const, label: "English" },
    { code: "deDE" as const, label: "Deutsch" },
    { code: "ruRU" as const, label: "Русский" },
  ];

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <div className="mr-auto">
          <ChevronDownIcon />
        </div>
        {t("common.language")}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="w-32">
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
