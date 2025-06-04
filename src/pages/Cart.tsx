import { useTranslation } from "@/i18n/useTranslation";
import { EmptyCart, OrderSummary, CartItems } from "@/features/cart";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";

function Cart() {
  const { t } = useTranslation();
  const cartState = useAppSelector((state) => state.cartState);
  const [hasItems, setHasItems] = useState(cartState.cartItems.length > 0);

  useEffect(() => {
    setHasItems(cartState.cartItems.length > 0);
  }, [cartState.cartItems.length]);

  if (!hasItems) {
    return <EmptyCart />;
  }

  return (
    <div className="container px-4 py-8 mx-auto bg-white dark:bg-green-600 rounded-xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {t("cart.title")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <CartItems />

        {/* Order Summary */}
        <OrderSummary />
      </div>
    </div>
  );
}
export default Cart;
