import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { AlignLeft } from "lucide-react";
import Button from "./Button";
import { links } from "@/utils/index";
import { NavLink } from "react-router-dom";

function LinksDropdown() {
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
