// store/notificationSlice.ts
import { Notification } from '@/api/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store'; // adjust path if needed

// --- State Interface ---
interface NotificationState {
  notifications: Notification[];
  loading: boolean;
}

// --- Initial State ---
const initialState: NotificationState = {
  notifications: [],
  loading: false,
};

// --- Slice ---
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications = [action.payload, ...state.notifications];
    },
    // markAsRead(state, action: PayloadAction<number>) {
    //   const notif = state.notifications.find(n => n.id === action.payload);
    //   if (notif) notif.isRead = true;
    // },
    clearNotification(state, action: PayloadAction<number>) {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) notif.isClear = true;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

// --- Export Actions ---
export const {
  setNotifications,
  addNotification,
  clearNotification,
  setLoading,
} = notificationSlice.actions;

// --- Export Reducer ---
export default notificationSlice.reducer;

// ==============================
// ✅ Selectors (place at bottom)
// ==============================

export const selectAllNotifications = (state: RootState) =>
  state.notifications.notifications;

export const selectNotificationCount = (state: RootState) =>
  state.notifications.notifications.length;

export const selectUnreadCount = (state: RootState) =>
  state.notifications.notifications.filter(n => !n.isRead).length;

export const selectUnclearedCount = (state: RootState) =>
  state.notifications.notifications.filter(n => !n.isClear).length;
