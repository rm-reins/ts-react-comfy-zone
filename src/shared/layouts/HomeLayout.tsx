import { Header, Navbar } from "@/features/navigation";
import { Outlet } from "react-router-dom";

function HomeLayout() {
  return (
    <>
      <Header />
      <Navbar />
      <div className="align-element py-10">
        <Outlet />
      </div>
    </>
  );
}
export default HomeLayout;
