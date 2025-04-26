import { configureStore } from "@reduxjs/toolkit";
import {
  themeReducer,
  userReducer,
  cartReducer,
  checkoutReducer,
} from "@/features/index";
import languageReducer from "@/features/language/languageSlice";
import type { ThemeState } from "@/features/theme/themeSlice";
import type { UserState } from "@/features/user/userSlice";
import type { CartState } from "@/features/cart/cartSlice";
import type { LanguageState } from "@/features/language/languageSlice";
import type { CheckoutState } from "@/features/checkout/checkoutSlice";

export const store = configureStore({
  reducer: {
    themeState: themeReducer,
    cartState: cartReducer,
    userState: userReducer,
    languageState: languageReducer,
    checkoutState: checkoutReducer,
  },
});

export type RootState = {
  themeState: ThemeState;
  cartState: CartState;
  userState: UserState;
  languageState: LanguageState;
  checkoutState: CheckoutState;
};

export type AppDispatch = typeof store.dispatch;

export type ReduxStore = {
  getState: () => RootState;
  dispatch: AppDispatch;
};
