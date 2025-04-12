import { Link } from "react-router-dom";
import Image from "../ui/Image";

function Logo() {
  return (
    <Link
      to="/"
      className="hidden md:flex justify-center items-center rounded-xl w-15 bg-white"
    >
      <Image
        src="/favicon-512x512.png"
        alt="logo"
        className="w-14 h-14"
      />
    </Link>
  );
}
export default Logo;
