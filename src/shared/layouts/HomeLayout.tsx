import { Navbar } from "@/features/navigation";
import { Outlet } from "react-router-dom";

function HomeLayout() {
  return (
    <>
      <Navbar />
      <div className="align-element py-10">
        <Outlet />
      </div>
    </>
  );
}
export default HomeLayout;
