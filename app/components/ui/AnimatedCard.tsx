import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

interface AnimatedCardProps {
  children: React.ReactNode;
  colors?: [string, string, ...string[]];
  onPress?: () => void;
  style?: any;
  delay?: number;
}

export default function AnimatedCard({
  children,
  colors = ["#FFFFFF", "#F8FAFC"],
  onPress,
  style,
  delay = 0,
}: AnimatedCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 50, scale: 0.9 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: delay * 100,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <MotiView
          animate={{
            shadowOpacity: onPress ? 0.15 : 0.1,
            shadowRadius: onPress ? 12 : 8,
          }}
          style={[styles.card, style]}
        >
          <LinearGradient
            colors={colors}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {children}
          </LinearGradient>
        </MotiView>
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  gradient: {
    padding: 20,
  },
});
