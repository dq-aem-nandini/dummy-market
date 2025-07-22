import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "@/api/services";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ViewProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const res = await getUser(userId!);
      setUser(res.response);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/profile")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      {/* Profile Avatar */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri:
              user.profileImageUrl ||
              "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.userName}</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.infoCard}>
        <ProfileItem label="📱 Mobile" value={user.mobileNumber} />
        <ProfileItem label="✉️ Email" value={user.email} />
        <ProfileItem
          label="🆔 Aadhaar"
          value={user.adhaarNumber || "Not Provided"}
        />
        <ProfileItem
          label="📅 Created"
          value={new Date(user.createdAt).toLocaleDateString()}
        />
        <ProfileItem
          label="✅ KYC"
          value={user.kycStatus ? "Completed" : "Pending"}
        />
        <ProfileItem
          label="🛡️ Status"
          value={user.approvalStatus ? "Approved" : "Pending"}
        />
      </View>
    </ScrollView>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#eee",
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
  },
  username: {
    fontSize: 14,
    color: "#666",
  },
  infoCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: {
    color: "#444",
    fontSize: 15,
    fontWeight: "500",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    maxWidth: "60%",
    textAlign: "right",
  },
});
