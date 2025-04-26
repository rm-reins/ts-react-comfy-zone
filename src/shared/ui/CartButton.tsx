import Button from "./Button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";

function CartButton() {
  const cartState = useSelector((state: RootState) => state.cartState);
  const [itemCount, setItemCount] = useState(cartState.numItemsInCart);

  // Update the item count whenever cartState changes
  useEffect(() => {
    setItemCount(cartState.numItemsInCart);
  }, [cartState.numItemsInCart]);

  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="flex justify-center items-center relative"
    >
      <Link to="/cart">
        <ShoppingCart />
        {itemCount > 0 && (
          <span className="absolute -top-3 -right-3 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}

export default CartButton;
