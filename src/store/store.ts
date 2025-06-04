import { configureStore } from "@reduxjs/toolkit";
import { themeReducer, cartReducer, checkoutReducer } from "@/features/index";
import languageReducer from "@/features/language/languageSlice";
import type { ThemeState } from "@/features/theme/themeSlice";
import type { CartState } from "@/features/cart/cartSlice";
import type { LanguageState } from "@/features/language/languageSlice";
import type { CheckoutState } from "@/features/checkout/checkoutSlice";

export const store = configureStore({
  reducer: {
    themeState: themeReducer,
    cartState: cartReducer,
    languageState: languageReducer,
    checkoutState: checkoutReducer,
  },
});

export type RootState = {
  themeState: ThemeState;
  cartState: CartState;
  languageState: LanguageState;
  checkoutState: CheckoutState;
};

export type AppDispatch = typeof store.dispatch;

export type ReduxStore = {
  getState: () => RootState;
  dispatch: AppDispatch;
};
