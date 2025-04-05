import { NavLink } from "react-router-dom";
import { useTranslation } from "@/i18n/useTranslation";

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
    <div className="hidden md:flex p-4 bg-white rounded-b-xl justify-center items-center gap-x-4">
      {links.map((link) => {
        return (
          <NavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) =>
              isActive ? "bg-primary text-white rounded-md px-3 py-1" : ""
            }
          >
            {link.label}
          </NavLink>
        );
      })}
    </div>
  );
}

export default NavLinks;
