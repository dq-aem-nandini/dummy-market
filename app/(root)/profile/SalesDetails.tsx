import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

function getString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? "";
}

export default function SalesDetails() {
  const { buyerName, productName, quantity, pricePerKg, requestStatus } =
    useLocalSearchParams();

  const qty = parseFloat(getString(quantity) || "0");
  const price = parseFloat(getString(pricePerKg) || "0");
  const total = qty * price;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/sales")}>
          <Ionicons name="arrow-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Sale Details</Text>
      </View>

      <View style={styles.card}>
        <Detail label="Product" value={getString(productName)} />
        <Detail label="Quantity" value={`${qty} kg`} />
        <Detail label="Price" value={`₹${price}/kg`} />
        <Detail label="Total" value={`₹${total.toFixed(2)}`} />
        <Detail label="Status" value={getString(requestStatus)} />
        <Detail label="Buyer" value={getString(buyerName)} />
      </View>
    </ScrollView>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#111827",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  row: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});
