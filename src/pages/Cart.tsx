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
import { Minus, Plus, Trash2 } from "lucide-react";
import { EmptyCart } from "@/features/cart";
import { OrderItem } from "@/trpc/types";

function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cartItems: OrderItem[] = [];

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 15.99 : 0;
  const total = subtotal + shipping;

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t("cart.title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="hidden md:grid grid-cols-12 gap-4 py-2 text-sm mx-5 font-medium text-muted-foreground">
            <div className="col-span-6">{t("cart.product")}</div>
            <div className="col-span-2 text-center">{t("cart.quantity")}</div>
            <div className="col-span-2 text-center">{t("cart.price")}</div>
            <div className="col-span-2 text-right">{t("cart.total")}</div>
          </div>

          {cartItems.map((item) => (
            <Card
              key={item._id}
              className="overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="md:col-span-6 flex gap-4 items-center">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        objectFit="fill"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        <p>
                          {t("cart.color")}: {item.color}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="md:hidden text-sm font-medium">
                      {t("cart.quantity")}
                    </span>
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                      >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">
                          {t("cart.decreaseQuantity")}
                        </span>
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
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
                    <span className="md:hidden text-sm font-medium">
                      {t("cart.price")}
                    </span>
                    <span>{item.price.toFixed(2)} €</span>
                  </div>

                  {/* Total */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end">
                    <span className="md:hidden text-sm font-medium">
                      {t("cart.total")}
                    </span>
                    <span className="font-medium">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-4 pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {t("cart.orderSummary")}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("cart.subtotal")}
                  </span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("cart.shipping")}
                  </span>
                  <span>{shipping.toFixed(2)} €</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>{t("cart.total")}</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6 pt-0">
              <Button
                className="w-full"
                size="lg"
              >
                {t("cart.checkout")}
              </Button>

              <Button
                variant="outline"
                className="w-full"
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
