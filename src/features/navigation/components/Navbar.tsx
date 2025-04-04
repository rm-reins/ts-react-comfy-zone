import { LinksDropdown, ModeToggle, CartButton, Logo } from "@/shared";
import { NavLinks } from "@/features/navigation";

function Navbar() {
  return (
    <nav className="bg-muted py-4 shadow-md">
      <div className="align-element flex justify-between items-center">
        <Logo />
        <LinksDropdown />
        <NavLinks />
        <div className="flex justify-center items-center gap-x-4">
          <ModeToggle />
          <CartButton />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
