import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  clerkId?: string;
  role: "user";
  deliveryAddress?: DeliveryAddress;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateDeliveryAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      if (state.user) {
        state.user.deliveryAddress = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  setUser,
  setLoading,
  setError,
  updateUserProfile,
  updateDeliveryAddress,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
