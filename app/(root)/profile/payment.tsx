
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const mockCards = [
  { id: "1", type: "Visa", last4: "4242", expiryMonth: "12", expiryYear: "26" },
  {
    id: "2",
    type: "Mastercard",
    last4: "5525",
    expiryMonth: "07",
    expiryYear: "25",
  },
];

export default function PaymentScreen() {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/profile")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 12 }}>
          Saved Cards
        </Text>
      </View>

      <FlatList
        data={mockCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-4 rounded-xl mb-3">
            <Text className="font-semibold">
              {item.type} **** {item.last4}
            </Text>
            <Text className="text-gray-600">
              Expiry: {item.expiryMonth}/{item.expiryYear}
            </Text>
          </View>
        )}
      />
      <View className="mt-4 bg-green-600 py-3 rounded-xl items-center">
        <Text className="text-white font-semibold">+ Add New Card</Text>
      </View>
    </View>
  );
}
