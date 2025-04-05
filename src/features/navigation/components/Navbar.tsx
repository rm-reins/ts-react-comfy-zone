import {
  LinksDropdown,
  ModeToggle,
  CartButton,
  Logo,
  LanguageDropdown,
} from "@/shared";
import { NavLinks } from "@/features/navigation";

function Navbar() {
  return (
    <nav className="pb-2 p-3.5 md:p-1 top-0">
      <div className="align-element flex justify-between items-center">
        <Logo />
        <LinksDropdown />
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <NavLinks />
        </div>
        <div className="flex justify-center items-center gap-x-4">
          <ModeToggle />
          <LanguageDropdown />
          <CartButton />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
