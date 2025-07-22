import React from "react";
import {
  StyleProp,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = styles.button;
    const sizeStyle = styles[`${size}Button`];
    return [baseStyle, sizeStyle, style];
  };

  const getTextStyle = () => {
    const baseStyle = styles.text;
    const sizeStyle = styles[`${size}Text`];
    const variantStyle = styles[`${variant}Text`];
    return [baseStyle, sizeStyle, variantStyle, textStyle];
  };

  const renderContent = () => (
    <Text style={getTextStyle()}>{loading ? "Loading..." : title}</Text>
  );

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <MotiView
          animate={{
            scale: disabled ? 0.95 : 1,
            opacity: disabled ? 0.6 : 1,
          }}
          transition={{ type: "timing", duration: 150 }}
          style={getButtonStyle()}
        >
          <LinearGradient
            colors={["#8B5CF6", "#7C3AED"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {renderContent()}
          </LinearGradient>
        </MotiView>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <MotiView
        animate={{
          scale: disabled ? 0.95 : 1,
          opacity: disabled ? 0.6 : 1,
        }}
        transition={{ type: "timing", duration: 150 }}
        style={[getButtonStyle(), styles[variant]]}
      >
        {renderContent()}
      </MotiView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  smButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mdButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  lgButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#374151",
  },
  outlineText: {
    color: "#8B5CF6",
  },
  ghostText: {
    color: "#8B5CF6",
  },
  secondary: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  ghost: {
    backgroundColor: "transparent",
  },
});

export default Button;
