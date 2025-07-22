import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ProductDTO } from "@/api/types";
import { getProducts, getMyProducts } from "@/api/services";

interface ProductsState {
  products: ProductDTO[];
  myProducts: ProductDTO[];
  loading: boolean;
  error: string | null;
  filters: {
    minPrice: number;
    maxPrice: number;
    searchText: string;
  };
}

const initialState: ProductsState = {
  products: [],
  myProducts: [],
  loading: false,
  error: null,
  filters: {
    minPrice: 0,
    maxPrice: 1000,
    searchText: "",
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: {
    page?: number;
    size?: number;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const response = await getProducts(
      params.page || 0,
      params.size || 10,
      params.minPrice,
      params.maxPrice
    );
    return response.response;
  }
);

export const fetchMyProducts = createAsyncThunk(
  "products/fetchMyProducts",
  async () => {
    const response = await getMyProducts();
    return response.response;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<typeof initialState.filters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearProducts: (state) => {
      state.products = [];
    },
    updateProduct: (state, action: PayloadAction<ProductDTO>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }

      const myIndex = state.myProducts.findIndex(
        (p) => p.id === action.payload.id
      );
      if (myIndex !== -1) {
        state.myProducts[myIndex] = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      state.myProducts = state.myProducts.filter(
        (p) => p.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      // Fetch my products
      .addCase(fetchMyProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.myProducts = action.payload;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch my products";
      });
  },
});

export const { setFilters, clearProducts, updateProduct, removeProduct } =
  productsSlice.actions;

// Selectors
export const selectProducts = (state: { products: ProductsState }) =>
  state.products.products;
export const selectMyProducts = (state: { products: ProductsState }) =>
  state.products.myProducts;
export const selectProductsLoading = (state: { products: ProductsState }) =>
  state.products.loading;
export const selectProductsError = (state: { products: ProductsState }) =>
  state.products.error;
export const selectProductsFilters = (state: { products: ProductsState }) =>
  state.products.filters;

export default productsSlice.reducer;
