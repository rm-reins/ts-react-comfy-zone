import Button from "./Button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

function CartButton() {
  const numberOfItems = 10;

  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="flex justify-center items-center relative shadow-none border-none"
    >
      <Link to="/cart">
        <ShoppingCart />
        <span className="absolute -top-3 -right-3 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
          {numberOfItems}
        </span>
      </Link>
    </Button>
  );
}

export default CartButton;
