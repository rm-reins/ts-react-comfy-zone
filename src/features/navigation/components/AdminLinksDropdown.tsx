import { useTranslation } from "@/i18n/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from "@/shared/ui";
import { AlignLeft } from "lucide-react";

type MenuItem = {
  id: string;
  label: string;
};

interface LinksDropdownProps {
  menuItems: MenuItem[];
  activeView: string;
  setActiveView: (view: string) => void;
}

function LinksDropdown({
  menuItems,
  activeView,
  setActiveView,
}: LinksDropdownProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="md:hidden"
      >
        <Button
          variant="outline"
          size="icon"
        >
          <AlignLeft className="size-4" />
          <span className="sr-only">{t("common.toggleLinks")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-32 md:hidden"
        align="start"
        sideOffset={25}
      >
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.id}
            className={item.id === activeView ? "bg-muted" : ""}
          >
            <div
              className="rounded-xl"
              onClick={() => setActiveView(item.id)}
            >
              {item.label}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;
