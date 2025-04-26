import { useTranslation } from "@/i18n/useTranslation";
import { ArrowUpRight } from "lucide-react";
import { CartState } from "@/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { trpc } from "@/trpc/trpc";
import { Order, User, OrderItem } from "@/trpc/types";
import { createOrder } from "@/features/orders/orderSlice";
import {
  resetCheckout,
  setOrder,
  calculateTotals,
} from "@/features/checkout/checkoutSlice";
import type { RootState } from "@/store/store";
import { useState, useEffect } from "react";

interface OrderSummaryProps {
  cart: CartState;
  setIsLoading?: (isLoading: boolean) => void;
  setError?: (error: string | null) => void;
}

function OrderSummary({ cart, setIsLoading, setError }: OrderSummaryProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkoutState = useSelector((state: RootState) => state.checkoutState);
  const createOrderMutation = trpc.order.createOrder.useMutation();
  const { data: user } = trpc.user.currentUser.useQuery() as {
    data: User | undefined;
  };
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [localIsLoading, setLocalIsLoading] = useState(false);

  // Update cart items in checkout state whenever cart changes
  useEffect(() => {
    if (cart.cartItems.length > 0) {
      const orderItems: OrderItem[] = cart.cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.images[0],
        quantity: item.quantity,
        color: item.color,
      }));

      dispatch(
        setOrder({
          ...checkoutState.order,
          orderItems,
          subtotal: cart.cartTotal,
          shippingFee: cart.shipping,
          tax: Math.ceil(cart.cartTotal * 0.21),
          total: cart.orderTotal,
        })
      );

      // Recalculate totals after updating cart items
      dispatch(calculateTotals());
    }
  }, [cart, dispatch]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Validate contact information
    const { contactInformation } = checkoutState.order;
    if (!contactInformation.name) errors.push(t("checkout.errorFirstName"));
    if (!contactInformation.surname) errors.push(t("checkout.errorLastName"));
    if (!contactInformation.email) errors.push(t("checkout.errorEmail"));
    if (!contactInformation.phone) errors.push(t("checkout.errorPhone"));

    // Validate delivery address
    const { deliveryAddress } = checkoutState.order;
    if (!deliveryAddress.street) errors.push(t("checkout.errorStreet"));
    if (!deliveryAddress.city) errors.push(t("checkout.errorCity"));
    if (!deliveryAddress.postalCode) errors.push(t("checkout.errorPostalCode"));
    if (!deliveryAddress.country) errors.push(t("checkout.errorCountry"));

    // Validate payment method
    if (!checkoutState.order.paymentMethod)
      errors.push(t("checkout.errorPaymentMethod"));

    // Validate terms acceptance
    if (!termsAccepted) errors.push(t("checkout.errorTerms"));

    // Validate cart is not empty
    if (cart.cartItems.length === 0) errors.push(t("checkout.errorEmptyCart"));

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Set loading state both locally and in parent component if available
    setLocalIsLoading(true);
    if (setIsLoading) setIsLoading(true);

    try {
      const orderData = {
        tax: checkoutState.order.tax,
        shippingFee: checkoutState.order.shippingFee,
        subtotal: checkoutState.order.subtotal,
        total: checkoutState.order.total,
        orderItems: checkoutState.order.orderItems,
        deliveryAddress: checkoutState.order.deliveryAddress,
        contactInformation: checkoutState.order.contactInformation,
        paymentMethod: checkoutState.order.paymentMethod,
        status: checkoutState.order.status,
        user: user?.clerkId,
        additionalInformation: checkoutState.order.additionalInformation,
      };

      const newOrder = (await createOrderMutation.mutateAsync(
        orderData
      )) as Order;

      dispatch(createOrder(newOrder));
      dispatch(resetCheckout());
      localStorage.removeItem("cart");
      navigate("/profile");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create an order";

      // Set error message locally and in parent component if available
      if (setError) setError(errorMessage);
      setFormErrors([errorMessage]);
    } finally {
      // Clean up loading state
      setLocalIsLoading(false);
      if (setIsLoading) setIsLoading(false);
    }
  };

  return (
    <>
      {formErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="font-medium text-red-700 dark:text-red-300 mb-2">
            {t("checkout.formErrors")}:
          </p>
          <ul className="list-disc pl-5 text-red-600 dark:text-red-300 text-sm">
            {formErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="border border-green-100 dark:border-green-800 bg-white dark:bg-green-900/30 rounded-lg p-4">
        <h2 className="text-base sm:text-lg font-medium mb-4 text-gray-900 dark:text-white">
          {t("checkout.orderSummary")}
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between pb-2 border-b border-green-100 dark:border-green-800">
            <span className="text-gray-600 dark:text-gray-200">
              {t("checkout.orderItems")}:
            </span>
            <span className="dark:text-white">{cart.numItemsInCart}</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-green-100 dark:border-green-800">
            <span className="text-gray-600 dark:text-gray-200">
              {t("checkout.orderAmount")}:
            </span>
            <span className="dark:text-white">{cart.cartTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-green-100 dark:border-green-800">
            <span className="text-gray-600 dark:text-gray-200">
              {t("checkout.orderShipping")}:
            </span>
            <span className="text-gray-400 dark:text-gray-200">
              {cart.shipping.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-medium">
            <span className="text-gray-900 dark:text-white">
              {t("checkout.orderSubtotal")}
            </span>
            <span className="text-gray-900 dark:text-green-100">
              {cart.orderTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-center sm:justify-end mt-10">
            <button
              className="flex text-lg justify-between items-center text-green-600 dark:text-green-100 font-bold border-b-2 border-green-600 dark:border-green-400 uppercase"
              onClick={handleSubmitOrder}
              disabled={localIsLoading}
            >
              {localIsLoading
                ? t("checkout.processing")
                : t("checkout.placeOrder")}
              {!localIsLoading && (
                <ArrowUpRight
                  size={28}
                  strokeWidth={2}
                />
              )}
            </button>
          </div>

          <div className="flex items-start space-x-2 mt-4">
            <input
              type="checkbox"
              required
              id="terms"
              name="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 mt-1 text-green-600 dark:text-green-400 border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-400"
            />
            <label
              htmlFor="terms"
              className="text-gray-600 dark:text-gray-200 text-sm"
            >
              {t("checkout.acceptTerms")}
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center mt-4 space-x-2">
        <input
          type="text"
          placeholder={t("checkout.promoCode")}
          className="flex-1 p-3 mb-3 lg:mb-0 border bg-white dark:bg-green-900/20 border-green-100 dark:border-green-800 rounded-md text-gray-600 dark:text-white dark:placeholder-gray-400"
        />
        <button className="text-green-600 dark:text-green-100 font-bold uppercase flex items-center whitespace-nowrap border-b-2 border-green-600 dark:border-green-400">
          {t("common.apply")}
          <ArrowUpRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </>
  );
}

export default OrderSummary;
