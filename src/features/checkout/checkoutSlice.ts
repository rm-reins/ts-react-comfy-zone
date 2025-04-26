import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "@/trpc/types";

interface CheckoutState {
  order: Order;
  error: string | null;
}

const initialState: CheckoutState = {
  order: {
    _id: "",
    tax: 0,
    shippingFee: 0,
    subtotal: 0,
    total: 0,
    orderItems: [],
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    contactInformation: {
      name: "",
      surname: "",
      email: "",
      phone: "",
    },
    paymentMethod: "",
    status: "pending",
    user: "",
    additionalInformation: "",
  },
  error: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<Order>) => {
      state.order = action.payload;
    },

    calculateTotals: (state) => {
      state.order.subtotal = state.order.orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      state.order.tax = Math.ceil(state.order.subtotal * 0.21);
      state.order.shippingFee = state.order.subtotal > 200 ? 0 : 25;
      state.order.total =
        state.order.subtotal + state.order.tax + state.order.shippingFee;
    },

    resetCheckout: () => initialState,
  },
});

export const { resetCheckout, calculateTotals, setOrder } =
  checkoutSlice.actions;

export type { CheckoutState };

export default checkoutSlice.reducer;
