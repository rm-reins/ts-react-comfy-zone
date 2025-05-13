import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from "@/shared/ui";
import { AlignLeft } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "@/i18n/useTranslation";
import { useState } from "react";

type Link = {
  href: string;
  label: string;
};

function LinksDropdown() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links: Link[] = [
    {
      href: "/",
      label: t("common.home"),
    },
    {
      href: "/products",
      label: t("common.products"),
    },
    {
      href: "/about",
      label: t("common.about"),
    },
  ];

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}
    >
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
        {links.map((link) => (
          <DropdownMenuItem
            key={link.href}
            className={link.href === location.pathname ? "bg-muted" : ""}
            onClick={() => setIsOpen(false)}
          >
            <NavLink
              to={link.href}
              className="text-foreground w-full"
            >
              {link.label}
            </NavLink>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;
