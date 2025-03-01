import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../utils/interface";

interface IProductState {
  products: IProduct[];
  totalProducts: number;
  productPageSize: number;
}

const initialState: IProductState = {
  products: [],
  totalProducts: 0,
  productPageSize: 5,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
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

export const { setProducts, setTotalProducts, setProductPageSize } =
  productSlice.actions;
export default productSlice.reducer;
