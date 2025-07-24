import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useDarkMode } from "@/app/context/DarkModeContext";

const mockAddresses = [
  {
    id: "home",
    label: "Home",
    address: "123 Main St, Hyderabad, Telangana 500001",
  },
  {
    id: "work",
    label: "Work",
    address: "456 Tech Park, Bangalore, Karnataka 560001",
  },
];

export default function AddressesScreen() {
  const {  colors } = useDarkMode();
  const dynamicStyles = StyleSheet.create({
    addressCard: {
      marginBottom: 12,
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
          <Ionicons name="arrow-back" size={24} color={colors.text}/>
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: colors.text }]}>Saved Addresses</Text>
      </View>

      <FlatList
        data={mockAddresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={dynamicStyles.addressCard}>
         
            <Text style={[styles.addressLabel, { color: colors.text }]}>{item.label}  </Text>
      
            <Text style={[styles.addressText, { color: colors.text }]}>{item.address}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
 
  addressLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  addressText: {
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
