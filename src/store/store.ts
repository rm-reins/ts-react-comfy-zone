import { configureStore } from "@reduxjs/toolkit";
import { themeReducer, userReducer, cartReducer } from "@/features/index";
import languageReducer from "@/features/language/languageSlice";
import type { ThemeState } from "@/features/theme/themeSlice";
import type { UserState } from "@/features/user/userSlice";
import type { CartState } from "@/features/cart/cartSlice";
import type { LanguageState } from "@/features/language/languageSlice";

export const store = configureStore({
  reducer: {
    themeState: themeReducer,
    cartState: cartReducer,
    userState: userReducer,
    languageState: languageReducer,
  },
});

export type RootState = {
  themeState: ThemeState;
  cartState: CartState;
  userState: UserState;
  languageState: LanguageState;
};

export type AppDispatch = typeof store.dispatch;

export type ReduxStore = {
  getState: () => RootState;
  dispatch: AppDispatch;
};
