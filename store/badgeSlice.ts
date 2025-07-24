import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BadgeState {
  notifications: number;
  sales: number;
  orders: number;
  chat: number;
}

const initialState: BadgeState = {
  notifications: 0,
  sales: 0,
  orders: 0,
  chat: 0,
};

const badgeSlice = createSlice({
  name: "badges",
  initialState,
  reducers: {
    setBadgeCount: (
      state,
      action: PayloadAction<{ type: keyof BadgeState; count: number }>
    ) => {
      const { type, count } = action.payload;
      state[type] = Math.max(0, count);
    },
    incrementBadge: (
      state,
      action: PayloadAction<keyof BadgeState>
    ) => {
      state[action.payload] += 1;
    },
    decrementBadge: (
      state,
      action: PayloadAction<keyof BadgeState>
    ) => {
      state[action.payload] = Math.max(0, state[action.payload] - 1);
    },
    clearBadge: (
      state,
      action: PayloadAction<keyof BadgeState>
    ) => {
      state[action.payload] = 0;
    },
    clearAllBadges: (state) => {
      state.notifications = 0;
      state.sales = 0;
      state.orders = 0;
      state.chat = 0;
    },
  },
});

export const {
  setBadgeCount,
  incrementBadge,
  decrementBadge,
  clearBadge,
  clearAllBadges,
} = badgeSlice.actions;

// Selectors
export const selectBadges = (state: { badges: BadgeState }) => state.badges;
export const selectNotificationsBadge = (state: { badges: BadgeState }) =>
  state.badges.notifications;
export const selectSalesBadge = (state: { badges: BadgeState }) =>
  state.badges.sales;
export const selectOrdersBadge = (state: { badges: BadgeState }) =>
  state.badges.orders;
export const selectChatBadge = (state: { badges: BadgeState }) =>
  state.badges.chat;

export default badgeSlice.reducer;