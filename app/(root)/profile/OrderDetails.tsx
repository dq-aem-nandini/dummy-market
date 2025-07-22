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

export default function OrderDetails() {
  const {
    productName,
    desiredQuantity,
    desiredPricePerKg,
    requestStatus,
    sendAt,
    sellerName,
  } = useLocalSearchParams();

  const quantity = parseFloat(getString(desiredQuantity) || "0");
  const price = parseFloat(getString(desiredPricePerKg) || "0");
  const total = quantity * price;
  const formattedDate = sendAt
    ? new Date(getString(sendAt)).toLocaleDateString()
    : "N/A";

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/orders")}>
          <Ionicons name="arrow-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
      </View>

      <View style={styles.card}>
        <Detail label="Product" value={getString(productName)} />
        <Detail label="Quantity" value={`${quantity} kg`} />
        <Detail label="Price" value={`₹${price}/kg`} />
        <Detail label="Total" value={`₹${total.toFixed(2)}`} />
        <Detail label="Status" value={getString(requestStatus)} />
        <Detail label="Seller" value={getString(sellerName)} />
        <Detail label="Ordered On" value={formattedDate} />
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
