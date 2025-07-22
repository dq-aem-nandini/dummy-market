import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getSentNotifications, getReceivedNotifications } from "@/api/services";

interface OrdersState {
  sentOrders: any[];
  receivedOrders: any[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  sentOrders: [],
  receivedOrders: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchSentOrders = createAsyncThunk(
  "orders/fetchSentOrders",
  async () => {
    const response = await getSentNotifications();
    return response.response;
  }
);

export const fetchReceivedOrders = createAsyncThunk(
  "orders/fetchReceivedOrders",
  async () => {
    const response = await getReceivedNotifications();
    return response.response;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: number; status: string }>
    ) => {
      const { id, status } = action.payload;

      // Update in sent orders
      const sentIndex = state.sentOrders.findIndex((order) => order.id === id);
      if (sentIndex !== -1) {
        state.sentOrders[sentIndex].requestStatus = status;
      }

      // Update in received orders
      const receivedIndex = state.receivedOrders.findIndex(
        (order) => order.id === id
      );
      if (receivedIndex !== -1) {
        state.receivedOrders[receivedIndex].requestStatus = status;
      }
    },
    addNewOrder: (state, action: PayloadAction<any>) => {
      state.sentOrders.unshift(action.payload);
    },
    addNewOrderRequest: (state, action: PayloadAction<any>) => {
      state.receivedOrders.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sent orders
      .addCase(fetchSentOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.sentOrders = action.payload;
      })
      .addCase(fetchSentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch sent orders";
      })
      // Fetch received orders
      .addCase(fetchReceivedOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceivedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedOrders = action.payload;
      })
      .addCase(fetchReceivedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch received orders";
      });
  },
});

export const { updateOrderStatus, addNewOrder, addNewOrderRequest } =
  ordersSlice.actions;

// Selectors
export const selectSentOrders = (state: { orders: OrdersState }) =>
  state.orders.sentOrders;
export const selectReceivedOrders = (state: { orders: OrdersState }) =>
  state.orders.receivedOrders;
export const selectOrdersLoading = (state: { orders: OrdersState }) =>
  state.orders.loading;
export const selectOrdersError = (state: { orders: OrdersState }) =>
  state.orders.error;

export default ordersSlice.reducer;
