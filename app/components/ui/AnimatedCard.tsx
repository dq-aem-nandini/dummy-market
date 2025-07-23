import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useDarkMode } from "@/app/context/DarkModeContext";
interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  delay?: number;
}
const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  delay = 0,
}) => {
  const { colors } = useDarkMode();
  const cardStyle = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
      marginVertical: 8,
    },
  });
  return <View style={[cardStyle.card, style]}>{children}</View>;
};
export default AnimatedCard;