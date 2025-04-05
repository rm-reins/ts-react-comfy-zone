import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { AlignLeft } from "lucide-react";
import Button from "./Button";
import { NavLink } from "react-router-dom";
import { useTranslation } from "@/i18n/useTranslation";

type Link = {
  href: string;
  label: string;
};

function LinksDropdown() {
  const { t } = useTranslation();

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
          <span className="sr-only">Toggle links</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-32 lg:hidden"
        align="start"
        sideOffset={25}
      >
        {links.map((link) => (
          <DropdownMenuItem key={link.href}>
            <NavLink to={link.href}>{link.label}</NavLink>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;
