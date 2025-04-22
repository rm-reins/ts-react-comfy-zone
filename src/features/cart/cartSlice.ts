import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Product, Order, OrderItem } from "@/trpc/types";
import { trpc } from "@/trpc/trpc";

interface CartState {
  cartItems: (Product & { quantity: number; color: string })[];
  numItemsInCart: number;
  cartTotal: number;
  shipping: number;
  tax: number;
  orderTotal: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartItems: [],
  numItemsInCart: 0,
  cartTotal: 0,
  shipping: 0,
  tax: 0,
  orderTotal: 0,
  isLoading: false,
  error: null,
};

const getLocalCart = (): CartState => {
  const cartData = localStorage.getItem("cart");
  return cartData ? JSON.parse(cartData) : initialState;
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getLocalCart(),
  reducers: {
    // this one for add to cart button
    addItem: (
      state,
      action: PayloadAction<Product & { quantity: number; color: string }>
    ) => {
      const { _id, color } = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === _id && item.color === color
      );

      if (itemIndex >= 0) {
        const existingItem = state.cartItems[itemIndex];
        state.cartItems[itemIndex] = {
          ...action.payload,
          quantity: existingItem.quantity + 1,
        };
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(state));
      cartSlice.caseReducers.countTotals(state);
    },

    removeItem: (state, action: PayloadAction<Product & { color: string }>) => {
      const { _id, color } = action.payload;

      state.cartItems = state.cartItems.filter(
        (item) => !(item._id == _id && item.color === color)
      );
      localStorage.setItem("cart", JSON.stringify(state));
      cartSlice.caseReducers.countTotals(state);
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
      cartSlice.caseReducers.countTotals(state);
    },

    // this one for setting quantity in cart view
    setCartItemQuantity: (
      state,
      action: PayloadAction<{ _id: string; color: string; quantity: number }>
    ) => {
      const { _id, color, quantity } = action.payload;

      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === _id && item.color === color
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity = quantity;
      }

      localStorage.setItem("cart", JSON.stringify(state));
      cartSlice.caseReducers.countTotals(state);
    },

    countTotals: (state) => {
      const { cartItems } = state;

      const { totalItems, cartTotal } = cartItems.reduce(
        (total, item) => {
          const { quantity, price } = item;
          total.totalItems += quantity;
          total.cartTotal += price * quantity;
          return total;
        },
        { totalItems: 0, cartTotal: 0 }
      );

      state.numItemsInCart = totalItems;
      state.cartTotal = cartTotal;
      state.tax = Math.ceil(cartTotal * 0.21);
      state.shipping = cartTotal > 200 ? 0 : 25;
      state.orderTotal = state.cartTotal + state.tax + state.shipping;

      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const createOrder = createAsyncThunk(
  "cart/createOrder",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { cart } = getState() as { cart: CartState };

      const orderItems: OrderItem[] = cart.cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.images[0],
        quantity: item.quantity,
        color: item.color,
      }));

      const orderData: Order = {
        tax: cart.tax,
        shippingFee: cart.shipping,
        subtotal: cart.cartTotal,
        total: cart.orderTotal,
        orderItems: orderItems,
      };

      const mutation = trpc.order.createOrder.useMutation();
      const order = await mutation.mutateAsync(orderData);

      return order;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create order"
      );
    }
  }
);

export const {
  addItem,
  removeItem,
  clearCart,
  setCartItemQuantity,
  countTotals,
} = cartSlice.actions;

export type { CartState };

export default cartSlice.reducer;
