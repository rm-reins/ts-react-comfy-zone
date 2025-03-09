import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link
      to="/"
      className="hidden lg:flex justify-center items-center rounded-4xl p-1.5 bg-white"
    >
      <img
        src="./favicon-512x512.png"
        alt="logo"
        className="w-14 h-14"
      />
    </Link>
  );
}
export default Logo;
