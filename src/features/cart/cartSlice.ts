import { createSlice } from "@reduxjs/toolkit";

export interface CartState {
  name: string;
}

const initialState: CartState = {
  name: "cart slice",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
});

export default cartSlice.reducer;
