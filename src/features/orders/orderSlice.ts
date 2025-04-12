import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "@/trpc/types";

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    getCurrentUserOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    getAllOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    getSingleOrder: (state, action: PayloadAction<Order>) => {
      state.orders = [...state.orders, action.payload];
      state.isLoading = false;
      state.error = null;
    },
    createOrder: (state, action: PayloadAction<Order>) => {
      state.orders = [...state.orders, action.payload];
      state.isLoading = false;
      state.error = null;
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      state.orders = state.orders.map((order) =>
        order._id === action.payload._id ? action.payload : order
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { getCurrentUserOrders, setLoading, setError } =
  orderSlice.actions;

export default orderSlice.reducer;
