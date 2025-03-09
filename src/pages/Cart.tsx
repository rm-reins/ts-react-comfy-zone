import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

function Cart() {
  return (
    <div>
      <h1 className="text-4xl">Cart Page</h1>
      <Link
        to="/"
        className="text-7xl text-red-900"
      >
        Back Home
      </Link>
      <Button
        asChild
        size="lg"
      >
        <Link to="/products">View Products</Link>
      </Button>
    </div>
  );
}
export default Cart;
