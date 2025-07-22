import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

interface AnimatedButtonProps {
  title: string;
  onPress?: () => void;
  colors?: [string, string, ...string[]];
  textColor?: string;
  size?: "small" | "medium" | "large";
}

export default function AnimatedButton({
  title,
  onPress,
  colors = ["#8B5CF6", "#7C3AED"],
  textColor = "#FFFFFF",
  size = "medium",
}: AnimatedButtonProps) {
  const sizeStyles = {
    small: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14 },
    medium: { paddingHorizontal: 24, paddingVertical: 12, fontSize: 16 },
    large: { paddingHorizontal: 32, paddingVertical: 16, fontSize: 18 },
  };

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <MotiView
          animate={{
            scale: pressed ? 0.95 : 1,
            shadowOpacity: pressed ? 0.2 : 0.3,
          }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 200,
          }}
          style={[
            styles.button,
            {
              paddingHorizontal: sizeStyles[size].paddingHorizontal,
              paddingVertical: sizeStyles[size].paddingVertical,
            },
          ]}
        >
          <LinearGradient
            colors={colors}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text
              style={[
                styles.text,
                {
                  color: textColor,
                  fontSize: sizeStyles[size].fontSize,
                },
              ]}
            >
              {title}
            </Text>
          </LinearGradient>
        </MotiView>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  gradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Inter-SemiBold",
    textAlign: "center",
  },
});
