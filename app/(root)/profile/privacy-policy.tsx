import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyPolicyScreen() {
  const [policyText, setPolicyText] = useState<string>("");

  useEffect(() => {
    // In a real app, you could fetch this from the backend
    setPolicyText(`
      We value your privacy and are committed to protecting your personal information.
      
      1. Data Collection:
         We collect your name, email, phone number, address, and payment information to provide better services.

      2. Data Usage:
         Your data is used to personalize your experience, manage orders, and improve our platform.

      3. Data Sharing:
         We never sell your data. Information is only shared with service providers essential for app operations.

      4. Security:
         We use encryption and authentication to secure your data.

      5. Changes:
         This policy may be updated. Check back regularly for any changes.

      For any questions, contact support@example.com.
    `);
  }, []);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/profile")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {/* <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 12 }}> */}
        <Text className="text-3xl font-bold ml-3">Privacy Policy</Text>
      </View>

      <Text className="text-base text-gray-700 leading-6 whitespace-pre-line">
        {policyText}
      </Text>
    </ScrollView>
  );
}
