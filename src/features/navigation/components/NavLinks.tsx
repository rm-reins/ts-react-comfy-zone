import { links } from "@/utils";
import { NavLink } from "react-router-dom";

function NavLinks() {
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
