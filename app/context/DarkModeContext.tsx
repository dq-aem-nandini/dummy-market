import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName } from "react-native";

interface DarkModeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colorScheme: ColorSchemeName;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    card: string;
    headerBackground: string;
    headerText: string;
  };
}

const lightColors = {
  background: "#F9FAFB",
  surface: "#FFFFFF",
  text: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  primary: "#8B5CF6",
  card: "#FFFFFF",
  headerBackground: "#8B5CF6",
  headerText: "#FFFFFF",
};

const darkColors = {
  background: "#111827",
  surface: "#1F2937",
  text: "#F9FAFB",
  textSecondary: "#9CA3AF",
  border: "#374151",
  primary: "#A78BFA",
  card: "#1F2937",
  headerBackground: "#1F2937",
  headerText: "#F9FAFB",
};

const DarkModeContext = createContext<DarkModeContextProps>(
  {} as DarkModeContextProps
);

export const DarkModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    // Load saved preference
    loadDarkModePreference();

    // Listen to system changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
      // Only auto-switch if user hasn't set a preference
      checkAutoSwitch(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const loadDarkModePreference = async () => {
    try {
      const savedMode = await AsyncStorage.getItem("darkModePreference");
      if (savedMode !== null) {
        setIsDarkMode(JSON.parse(savedMode));
      } else {
        // Use system preference if no saved preference
        setIsDarkMode(Appearance.getColorScheme() === "dark");
      }
    } catch (error) {
      console.error("Error loading dark mode preference:", error);
    }
  };

  const checkAutoSwitch = async (systemColorScheme: ColorSchemeName) => {
    try {
      const savedMode = await AsyncStorage.getItem("darkModePreference");
      if (savedMode === null) {
        // No user preference, follow system
        setIsDarkMode(systemColorScheme === "dark");
      }
    } catch (error) {
      console.error("Error checking auto switch:", error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem("darkModePreference", JSON.stringify(newMode));
    } catch (error) {
      console.error("Error saving dark mode preference:", error);
    }
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <DarkModeContext.Provider
      value={{ isDarkMode, toggleDarkMode, colorScheme, colors }}
    >
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
