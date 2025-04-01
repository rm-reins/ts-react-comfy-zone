import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Admin {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  clerkId?: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
}

interface AdminState {
  admin: Admin | null;
  allAdmins: Admin[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AdminState = {
  admin: null,
  allAdmins: [],
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin | null>) => {
      state.admin = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setAllAdmins: (state, action: PayloadAction<Admin[]>) => {
      state.allAdmins = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateAdminProfile: (state, action: PayloadAction<Partial<Admin>>) => {
      if (state.admin) {
        state.admin = { ...state.admin, ...action.payload };
      }
    },
    promoteToAdmin: (state, action: PayloadAction<Admin>) => {
      state.allAdmins.push(action.payload);
    },
    demoteToUser: (state, action: PayloadAction<string>) => {
      state.allAdmins = state.allAdmins.filter(
        (admin) => admin._id !== action.payload
      );
    },
    logout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  setAdmin,
  setAllAdmins,
  setLoading,
  setError,
  updateAdminProfile,
  promoteToAdmin,
  demoteToUser,
  logout,
} = adminSlice.actions;

export default adminSlice.reducer;
