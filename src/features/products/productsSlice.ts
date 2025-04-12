import { createSlice } from "@reduxjs/toolkit";
import { Product } from "@/trpc/types";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    getAllProducts: (state, action) => {
      state.products = action.payload;
    },
    getSingleProduct: (state, action) => {
      state.products = action.payload;
    },
    createProduct: (state, action) => {
      state.products = [...state.products, action.payload];
    },
    updateProduct: (state, action) => {
      state.products = state.products.map((product: Product) =>
        product._id === action.payload._id ? action.payload : product
      );
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product: Product) => product._id !== action.payload._id
      );
    },
  },
});

export const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = productsSlice.actions;
export default productsSlice.reducer;
