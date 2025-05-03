import { Button } from "@/shared/ui";
import { ReactNode } from "react";

type MenuItem = {
  id: string;
  label: string;
  component: ReactNode;
};

interface AdminNavlinksProps {
  menuItems: MenuItem[];
  activeView: string;
  setActiveView: (view: string) => void;
}

function AdminNavlinks({
  menuItems,
  activeView,
  setActiveView,
}: AdminNavlinksProps) {
  return (
    <div className="hidden md:flex p-4 rounded-b-xl justify-center items-center gap-x-2">
      {menuItems.map((item) => {
        return (
          <Button
            key={item.id}
            variant={activeView === item.id ? "default" : "outline"}
            className="rounded-xl"
            onClick={() => setActiveView(item.id)}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}

export default AdminNavlinks;
