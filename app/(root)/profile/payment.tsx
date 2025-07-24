import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useDarkMode } from "@/app/context/DarkModeContext";

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

  const {  colors } = useDarkMode();
  const dynamicStyles = StyleSheet.create({
    cardItem: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 10,
      marginHorizontal: 0,
      backgroundColor: colors.surface,
      padding: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      borderRadius: 12,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
  })
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/profile")}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Saved Cards</Text>
      </View>

      <FlatList
        data={mockCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={dynamicStyles.cardItem}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {item.type} **** {item.last4}
            </Text>
            <Text style={[styles.cardExpiry, { color: colors.text }]}>
              Expiry: {item.expiryMonth}/{item.expiryYear}
            </Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add New Card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  cardItem: {
    marginBottom: 12,
    marginHorizontal: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 14,
    color: "#6b7280",
  },
  addButton: {
    marginTop: 16,
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
