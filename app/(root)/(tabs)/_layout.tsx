// app/_layout.tsx or app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getNotifications,
  getReceivedNotifications,
  getSentNotifications,
} from "@/api/services";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToBuyer,
  subscribeToSeller,
  subscribeToMessages,
} from "@/api/websocket";

import { setNotifications, addNotification } from "@/store/notificationSlice";
import { addMessage } from "@/store/chatSlice";
import { RootState } from "@/store";
import { Notification } from "@/api/types";
import { logger } from "@/utils/logger";

export default function TabsLayout() {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );
  const [userId, setUserId] = useState<string | null>(null);

  // const deduplicateById = (list: Notification[]) => {
  //   const map = new Map<number, Notification>();
  //   list.forEach((n) => map.set(n.id, n));
  //   return Array.from(map.values());
  // };

  const fetchAllNotifications = async () => {
    try {
      const [notifications] = await Promise.all([getNotifications()]);
      const received = notifications?.response || [];
      logger.info("Fetched notifications", { count: received.length });
      dispatch(setNotifications(received));
    } catch (err) {
      logger.error("Notification fetch failed", err);
    }
  };

  const setupWebSocket = async () => {
    const uid = await AsyncStorage.getItem("userId");
    if (!uid) return;
    setUserId(uid);
    connectWebSocket(() => {
      subscribeToSeller(uid, (msg) => {
        try {
          const newNotif: Notification = JSON.parse(msg.body);
          logger.wsMessage("Seller notification received", newNotif);
          dispatch(addNotification(newNotif));
        } catch (err) {
          logger.error("WebSocket message parse error", err);
        }
      });
      subscribeToBuyer(uid, (msg) => {
        try {
          const newNotif: Notification = JSON.parse(msg.body);
          logger.wsMessage("Buyer notification received", newNotif);
          dispatch(addNotification(newNotif));
        } catch (err) {
          logger.error("WebSocket message parse error", err);
        }
      });

      // Subscribe to chat messages
      subscribeToMessages(uid, (msg) => {
        try {
          const chatMessage = JSON.parse(msg.body);
          logger.wsMessage("Chat message received", chatMessage);

          // Create conversation ID
          const conversationId = `${chatMessage.senderId}-${chatMessage.receiverId}-${chatMessage.productId}`;
          dispatch(addMessage({ conversationId, message: chatMessage }));
        } catch (err) {
          logger.error("Chat message parse error", err);
        }
      });
    });
  };

  useEffect(() => {
    fetchAllNotifications();
    setupWebSocket();
    return () => disconnectWebSocket();
  }, []);

  const totalBadgeCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6B21A8",
        tabBarStyle: {
          height: 75,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarBadgeStyle: {
          backgroundColor: "red",
          fontSize: 10,
          fontWeight: "bold",
          color: "white",
          minWidth: 18,
          height: 18,
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="myproducts"
        options={{
          title: "My-Products",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="seedling" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: "Sales",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="sellcast" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Order",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="shopping-basket" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="rocketchat" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" color={color} size={size} />
          ),
          tabBarBadge: totalBadgeCount > 0 ? totalBadgeCount : undefined,
        }}
      />
      {/* <Tabs.Screen
        name="cart"
        options={{
          href: null, // Hide this tab as it's not implemented
        }}
      /> */}
    </Tabs>
  );
}
