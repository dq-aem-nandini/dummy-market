import { Slot, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Platform } from "react-native";

export default function RootLayout() {
  const { userToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userToken) {
      router.replace("/(auth)/sign-in");
    }
  }, [userToken]);

  return (
    <SafeAreaView style={styles.container}>
      <Slot />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 52 : 0,
  },
});
