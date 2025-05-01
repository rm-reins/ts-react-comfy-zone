import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Separator,
  Image,
} from "@/shared/ui";
import { useTranslation } from "@/i18n/useTranslation";
import { Minus, Plus, Trash2, ArrowUpRight } from "lucide-react";
import { EmptyCart } from "@/features/cart";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCartItemQuantity, removeItem } from "@/features/cart/cartSlice";
import { useEffect, useState } from "react";
import { useToast } from "@/shared/ui";

function Cart() {
  const { t, language } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartState = useSelector((state: RootState) => state.cartState);
  const [hasItems, setHasItems] = useState(cartState.cartItems.length > 0);

  useEffect(() => {
    setHasItems(cartState.cartItems.length > 0);
  }, [cartState.cartItems.length]);

  if (!hasItems) {
    return <EmptyCart />;
  }

  const {
    cartItems,
    cartTotal: subtotal,
    shipping,
    orderTotal: total,
  } = cartState;

  // Handle quantity changes
  const handleDecreaseQuantity = (
    itemId: string,
    color: string,
    currentQuantity: number
  ) => {
    if (currentQuantity > 1) {
      dispatch(
        setCartItemQuantity({
          _id: itemId,
          color,
          quantity: currentQuantity - 1,
        })
      );
    }
  };

  const handleIncreaseQuantity = (
    itemId: string,
    color: string,
    currentQuantity: number
  ) => {
    dispatch(
      setCartItemQuantity({
        _id: itemId,
        color,
        quantity: currentQuantity + 1,
      })
    );
  };

  // Handle item removal
  const handleRemoveItem = (item: (typeof cartItems)[0]) => {
    try {
      dispatch(removeItem(item));
      showToast({
        title: t("products.removedFromCart"),
        description: t("products.removedFromCartDescription"),
        variant: "success",
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      showToast({
        title: t("common.error"),
        description:
          error instanceof Error
            ? error.message
            : t("products.errorRemovingFromCart"),
        variant: "error",
      });
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto bg-white dark:bg-green-600 rounded-xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {t("cart.title")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="hidden md:grid grid-cols-12 gap-4 py-2 text-base mx-5 font-medium text-muted-foreground dark:text-gray-300">
            <div className="col-span-6">{t("cart.product")}</div>
            <div className="col-span-2 text-center">{t("cart.quantity")}</div>
            <div className="col-span-2 text-center">{t("cart.price")}</div>
            <div className="col-span-2 text-right">{t("cart.total")}</div>
          </div>

          {cartItems.map((item) => (
            <Card
              key={`${item._id}-${item.color}`}
              className="overflow-hidden dark:bg-green-900/20 dark:border-green-800"
            >
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="md:col-span-6 flex gap-4 items-center">
                    <div
                      className="relative h-20 w-20 rounded-xl overflow-hidden bg-muted dark:bg-green-800/30 cursor-pointer"
                      onClick={() => navigate(`/products/${item._id}`)}
                    >
                      <Image
                        src={item.images?.[0] || "/placeholder.svg"}
                        alt={item.name[language]}
                        layout="fill"
                      />
                    </div>
                    <div>
                      <h3
                        className="font-medium text-lg cursor-pointer text-gray-900 dark:text-white"
                        onClick={() => navigate(`/products/${item._id}`)}
                      >
                        {item.name[language]}
                      </h3>
                      <div className="text-sm text-muted-foreground dark:text-gray-300 mt-1 flex items-center gap-2">
                        <p>{t("cart.color")}</p>
                        <div
                          className="w-6 h-6 rounded-full border dark:border-gray-700"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="md:hidden text-sm font-medium dark:text-gray-300">
                      {t("cart.quantity")}
                    </span>
                    <div className="flex items-center border dark:border-green-800 rounded-xl">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none dark:text-gray-300 dark:hover:text-white dark:hover:bg-green-800/50"
                        onClick={() =>
                          handleDecreaseQuantity(
                            item._id,
                            item.color,
                            item.quantity
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">
                          {t("cart.decreaseQuantity")}
                        </span>
                      </Button>
                      <span className="w-8 text-center dark:text-white">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none dark:text-gray-300 dark:hover:text-white dark:hover:bg-green-800/50"
                        onClick={() =>
                          handleIncreaseQuantity(
                            item._id,
                            item.color,
                            item.quantity
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">
                          {t("cart.increaseQuantity")}
                        </span>
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="md:hidden text-sm font-medium dark:text-gray-300">
                      {t("cart.price")}
                    </span>
                    <span className="dark:text-white">{`${item.price.toFixed(
                      2
                    )} €`}</span>
                  </div>

                  {/* Total */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end">
                    <span className="md:hidden text-sm font-medium dark:text-gray-300">
                      {t("cart.total")}
                    </span>
                    <span className="font-medium dark:text-green-100">
                      {`${(item.price * item.quantity).toFixed(2)} €`}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-4 pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                  onClick={() => handleRemoveItem(item)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("cart.remove")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="dark:bg-green-900/20 dark:border-green-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {t("cart.orderSummary")}
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground dark:text-gray-300">
                    {t("cart.subtotal")}
                  </span>
                  <span className="dark:text-white">{`${subtotal.toFixed(
                    2
                  )} €`}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground dark:text-gray-300">
                    {t("cart.shipping")}
                  </span>
                  <span className="dark:text-white">{`${shipping.toFixed(
                    2
                  )} €`}</span>
                </div>

                <Separator className="dark:bg-green-800" />

                <div className="flex justify-between font-bold">
                  <span className="dark:text-white">{t("cart.total")}</span>
                  <span className="dark:text-green-100">{`${total.toFixed(
                    2
                  )} €`}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 p-6 pt-0">
              <button
                className="w-full h-10 justify-center rounded-xl px-6 has-[>svg]:px-4 text-lg shadow-xs bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium flex items-center uppercase"
                onClick={() => navigate("/checkout")}
              >
                {t("cart.checkout")}
                <ArrowUpRight
                  size={28}
                  strokeWidth={2}
                />
              </button>

              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-900 dark:hover:bg-green-900/30 dark:hover:text-green-100"
                onClick={() => navigate("/products")}
              >
                {t("cart.continueShopping")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default Cart;
