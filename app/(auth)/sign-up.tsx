import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useDarkMode } from "../context/DarkModeContext";

export default function SignUpScreen() {
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    adhaarNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
 const { colors } = useDarkMode();
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.adhaarNumber && !/^\d{12}$/.test(formData.adhaarNumber)) {
      newErrors.adhaarNumber = "Aadhaar number must be 12 digits";
    }
    if (!agreeToTerms) {
      newErrors.terms = "Please agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    const { confirmPassword, ...registerForm } = formData;

    try {
      await register({
        ...registerForm,
        mobileNumber: String(registerForm.mobileNumber),
        adhaarNumber: registerForm.adhaarNumber
          ? String(registerForm.adhaarNumber)
          : "",
      });

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/(auth)/sign-in") },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Registration Failed",
        err?.message || "Something went wrong."
      );
    }
  };

  const renderHeader = () => (
    <LinearGradient colors={["#10B981", "#059669"]} style={styles.header}>
      <View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Create Account 🌱</Text>
          <Text style={styles.subtitle}>
            Join the seed marketplace community
          </Text>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    
    <View style={styles.container}>
      {renderHeader()}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Card  style={styles.formCard}>
            <View style={styles.form}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
                error={errors.name}
                leftIcon="person-outline"
                labelColor={colors.text}
              />

              <Input
                label="Username"
                placeholder="Choose a username"
                value={formData.userName}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, userName: text }))
                }
                error={errors.userName}
                leftIcon="at-outline"
                autoCapitalize="none"
                labelColor={colors.text}
              />

              <Input
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
                error={errors.email}
                leftIcon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                labelColor={colors.text}
              />

              <Input
                label="Mobile Number"
                placeholder="Enter 10-digit mobile number"
                value={formData.mobileNumber}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, mobileNumber: text }))
                }
                error={errors.mobileNumber}
                leftIcon="call-outline"
                keyboardType="numeric"
                maxLength={10}
                labelColor={colors.text}
              />

              <Input
                label="Aadhaar Number (Optional)"
                placeholder="Enter 12-digit Aadhaar number"
                value={formData.adhaarNumber}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, adhaarNumber: text }))
                }
                error={errors.adhaarNumber}
                leftIcon="card-outline"
                keyboardType="numeric"
                maxLength={12}
                labelColor={colors.text}
              />

              <Input
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, password: text }))
                }
                error={errors.password}
                leftIcon="lock-closed-outline"
                rightIcon={showPassword ? "eye-outline" : "eye-off-outline"}
                onRightIconPress={() => setShowPassword(!showPassword)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                labelColor={colors.text}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: text }))
                }
                error={errors.confirmPassword}
                leftIcon="lock-closed-outline"
                rightIcon={
                  showConfirmPassword ? "eye-outline" : "eye-off-outline"
                }
                onRightIconPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                labelColor={colors.text}
              />

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreeToTerms && styles.checkboxChecked,
                  ]}
                >
                  {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
      
                <Text style={[styles.checkboxText, { color: colors.text }]}>
                  I agree to the Terms and Conditions
                </Text>
              </TouchableOpacity>
              {errors.terms && (
                <Text style={styles.errorText}>{errors.terms}</Text>
              )}

              <Button
                title={loading ? "Creating Account..." : "Create Account"}
                onPress={handleSignUp}
                loading={loading}
                style={styles.signUpButton}
              />

              <View style={styles.signInContainer}>
                <Text style={[styles.signInText, { color: colors.text }]}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/sign-in")}
                >
                  <Text style={styles.signInLink}>Sign In</Text>  
                </TouchableOpacity>

              </View>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerContainer: {
    marginBottom: -20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 16,
    color: "#D1FAE5",
    textAlign: "center",
    lineHeight: 22,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 10,
  },
  formCard: {
    marginTop:10,
  },
  form: {
    gap: 0,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",

  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  checkboxText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: -8,
  },
  signUpButton: {
    marginTop: 10,
    paddingVertical: 16,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signInText: {
    fontSize: 16,
    color: "#6B7280",
  },
  signInLink: {
    fontSize: 16,
    color: "#8B5CF6",
    fontWeight: "600",
  },
});