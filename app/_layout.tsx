import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/store";
import "./global.css";
import { AuthProvider } from "@/app/context/AuthContext";
import { DarkModeProvider } from "@/app/context/DarkModeContext";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";

export default function RootLayout() {
  useFrameworkReady();
  return (
    <AuthProvider>
      <DarkModeProvider>
        <Provider store={store}>
          <Slot />
        </Provider>
      </DarkModeProvider>
    </AuthProvider>
  );
}
