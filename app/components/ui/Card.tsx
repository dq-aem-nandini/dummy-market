import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

import { useDarkMode } from "@/app/context/DarkModeContext";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  animated?: boolean;
  delay?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  animated = true,
  delay = 0,
}) => {
  const { colors } = useDarkMode();

  const dynamicStyles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
      marginVertical: 4,
    },
  });

  if (animated) {
    return <View style={[dynamicStyles.card, style]}>{children}</View>;
  }

  return <View style={[dynamicStyles.card, style]}>{children}</View>;
};

export default Card;
