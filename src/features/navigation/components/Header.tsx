import { useNavigate } from "react-router-dom";
import { Button } from "@/shared";
import { useUser, useClerk } from "@clerk/clerk-react";

function Header() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/sign-in");
  };

  return (
    <div>
      <div className="align-element flex justify-center sm:justify-end py-2">
        {user ? (
          <div className="flex gap-x-2 sm:pr-2 sm:gap-x-8 items-center">
            <p className="text-xs sm:text-sm">Hello, {user.firstName}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogin}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
}

export default Header;
