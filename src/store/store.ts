import { configureStore } from "@reduxjs/toolkit";
import { themeReducer, userReducer, cartReducer } from "@/features/index";
import type { ThemeState } from "@/features/theme/themeSlice";
import type { UserState } from "@/features/user/userSlice";
import type { CartState } from "@/features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    themeState: themeReducer,
    cartState: cartReducer,
    userState: userReducer,
  },
});

export type RootState = {
  themeState: ThemeState;
  cartState: CartState;
  userState: UserState;
};

export type AppDispatch = typeof store.dispatch;

export type ReduxStore = {
  getState: () => RootState;
  dispatch: AppDispatch;
};
