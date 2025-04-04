import { Link } from "react-router-dom";

function ErrorImage() {
  return (
    <Link
      to="/"
      className="flex justify-center items-center rounded-full p-8 bg-white"
    >
      <img
        src="/comfy-zone-error.png"
        alt="Error illustration"
        className="w-62 h-62"
      />
    </Link>
  );
}
export default ErrorImage;
