// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notificationSlice";
import productsReducer from "./productsSlice";
import ordersReducer from "./ordersSlice";
import chatReducer from "./chatSlice";
import badgeReducer from "./badgeSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    products: productsReducer,
    orders: ordersReducer,
    chat: chatReducer,
    badges: badgeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
