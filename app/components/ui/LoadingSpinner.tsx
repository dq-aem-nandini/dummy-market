import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "#8B5CF6",
}) => {
  const getSize = () => {
    switch (size) {
      case "sm":
        return 20;
      case "lg":
        return 40;
      default:
        return 30;
    }
  };

  const spinnerSize = getSize();

  return (
    <View style={styles.container}>
      <MotiView
        from={{ rotate: "0deg" }}
        animate={{ rotate: "360deg" }}
        transition={{
          type: "timing",
          duration: 1000,
          loop: true,
        }}
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderColor: `${color}20`,
            borderTopColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    borderWidth: 2,
    borderRadius: 50,
  },
});

export default LoadingSpinner;
