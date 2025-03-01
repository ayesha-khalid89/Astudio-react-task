// src/redux/slices/productSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../utils/interface";

interface ProductState {
  products: Product[];
  totalProducts: number;
  productPageSize: number;
}

const initialState: ProductState = {
  products: [],
  totalProducts: 0,
  productPageSize: 5,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setTotalProducts: (state, action: PayloadAction<number>) => {
      state.totalProducts = action.payload;
    },
    setProductPageSize: (state, action: PayloadAction<number>) => {
      state.productPageSize = action.payload;
    },
  },
});

export const { setProducts, setTotalProducts, setProductPageSize } = productSlice.actions;
export default productSlice.reducer;
