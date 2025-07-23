import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/store";
import "./global.css";
import { AuthProvider } from "@/app/context/AuthContext";
import { DarkModeProvider, useDarkMode } from "@/app/context/DarkModeContext";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { StatusBar, View, Platform, StyleSheet, SafeAreaView } from "react-native";

function InnerLayout() {
  const { isDarkMode, colors } = useDarkMode();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent={true}
      />
      <Slot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <DarkModeProvider>
        <Provider store={store}>
          <InnerLayout />
        </Provider>
      </DarkModeProvider>
    </AuthProvider>
  );
}
