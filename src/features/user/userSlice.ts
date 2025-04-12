import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, DeliveryAddress } from "@/trpc/types";

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

    addDeliveryAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      if (state.user) {
        state.user.deliveryAddresses?.push(action.payload);
      }
    },
    updateDeliveryAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      if (state.user) {
        state.user.deliveryAddresses = state.user.deliveryAddresses?.map(
          (addr) => (addr._id === action.payload._id ? action.payload : addr)
        );
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    deleteDeliveryAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      if (state.user) {
        state.user.deliveryAddresses = state.user.deliveryAddresses?.filter(
          (addr) => addr._id !== action.payload._id
        );
      }
    },
    setDefaultDeliveryAddress: (
      state,
      action: PayloadAction<DeliveryAddress>
    ) => {
      if (state.user) {
        state.user.deliveryAddresses = state.user.deliveryAddresses?.map(
          (addr) => ({
            ...addr,
            isDefault: addr._id === action.payload._id,
          })
        );
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
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
  addDeliveryAddress,
  deleteDeliveryAddress,
  setDefaultDeliveryAddress,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
