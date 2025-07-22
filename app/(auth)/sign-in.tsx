import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import AnimatedCard from "../components/ui/AnimatedCard";
import AnimatedButton from "../components/ui/AnimatedButton";

export default function SignInScreen() {
  const { login, loading } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSignIn = async () => {
    if (!userName || !password) {
      Alert.alert("Validation", "Please enter both username and password.");
      return;
    }

    try {
      await login(userName, password);
      router.replace("/(root)/(tabs)/profile");
    } catch (error) {
      setLocalError("Invalid username or password");
      setTimeout(() => setLocalError(""), 3000);
    }
  };

  return (
    <LinearGradient
      colors={["#1E1B4B", "#312E81", "#4C1D95"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            style={styles.header}
          >
            <Text style={styles.title}>Welcome Back 👋</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your journey
            </Text>
          </MotiView>

          {/* Error message */}
          {localError !== "" && (
            <Text
              style={{ color: "red", textAlign: "center", marginBottom: 10 }}
            >
              {localError}
            </Text>
          )}

          {/* Form */}
          <AnimatedCard
            delay={1}
            style={styles.formCard}
            colors={["rgba(255, 255, 255, 0.95)", "rgba(248, 250, 252, 0.95)"]}
          >
            <View style={styles.form}>
              {/* Username Input */}
              <MotiView
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 100,
                  delay: 200,
                }}
                style={styles.inputContainer}
              >
                <Text style={styles.inputLabel}>Username</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#6B7280"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#9CA3AF"
                    value={userName}
                    keyboardType="default"
                    onChangeText={setUserName}
                    autoCapitalize="none"
                  />
                </View>
              </MotiView>

              {/* Password Input */}
              <MotiView
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 100,
                  delay: 300,
                }}
                style={styles.inputContainer}
              >
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#6B7280"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </MotiView>

              {/* Forgot Password */}
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 100,
                  delay: 400,
                }}
                style={styles.forgotContainer}
              >
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </MotiView>

              {/* Sign In Button */}
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 100,
                  delay: 500,
                }}
                style={styles.buttonContainer}
              >
                <AnimatedButton
                  title={loading ? "Signing In..." : "Sign In"}
                  onPress={handleSignIn}
                  colors={["#8B5CF6", "#7C3AED"]}
                  size="large"
                />
              </MotiView>

              {/* Sign Up Link */}
              <MotiView
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 100,
                  delay: 800,
                }}
                style={styles.signUpContainer}
              >
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/sign-up")}
                >
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </MotiView>
            </View>
          </AnimatedCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 170,
    paddingBottom: 40,
  },
  header: { marginBottom: 40 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#A78BFA",
    textAlign: "center",
  },
  formCard: {
    marginBottom: 30,
  },
  form: { gap: 20 },
  inputContainer: { gap: 8 },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#374151",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#111827",
  },
  eyeIcon: { padding: 4 },
  forgotContainer: { alignItems: "flex-end" },
  forgotText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#8B5CF6",
  },
  buttonContainer: { marginTop: 10 },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#A78BFA",
  },
  signUpLink: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#A78BFA",
  },
});
