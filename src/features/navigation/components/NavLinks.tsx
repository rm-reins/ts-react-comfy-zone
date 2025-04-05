import { NavLink } from "react-router-dom";
import { useTranslation } from "@/i18n/useTranslation";
import { Button } from "@/shared/ui";

type Link = {
  href: string;
  label: string;
};

function NavLinks() {
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
    <div className="hidden md:flex p-4 rounded-b-xl justify-center items-center gap-x-2">
      {links.map((link) => {
        return (
          <NavLink
            key={link.href}
            to={link.href}
            className=""
          >
            {({ isActive }) => (
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="rounded-md"
              >
                {link.label}
              </Button>
            )}
          </NavLink>
        );
      })}
    </div>
  );
}

export default NavLinks;
