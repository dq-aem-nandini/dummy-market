import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ProductDTO } from "@/api/types";
import { useDarkMode } from "../context/DarkModeContext";

interface ProductCardProps {
  product: ProductDTO;
  onPress?: () => void;
  onChatPress?: () => void;
  onRequestPress?: () => void;
  isOwner?: boolean;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onChatPress,
  onRequestPress,
  isOwner = false,
  delay = 0,
}) => {
  const { colors } = useDarkMode();
  const dynamicStyles = StyleSheet.create({
    menuCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      marginHorizontal: 16,
      backgroundColor: colors.surface,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      borderRadius: 12,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
  });
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={dynamicStyles.menuCard}>
        <View style={styles.content}>
          {/* Product Image with Stock Badge */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  product.image ||
                  "https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=400",
              }}
              style={styles.image}
            />
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>
                {product.remainingQuantityKg.toFixed(1)} kg
              </Text>
            </View>
          </View>

          {/* Product Info */}
          <View style={styles.info}>
            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={2}
            >
              {product.name}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {product.description}
            </Text>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{product.pricePerKg}/kg</Text>
            </View>

            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  product.remainingQuantityKg > 0
                    ? styles.availableBadge
                    : styles.outOfStockBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    product.remainingQuantityKg > 0
                      ? styles.availableText
                      : styles.outOfStockText,
                  ]}
                >
                  {product.remainingQuantityKg > 0
                    ? "Available"
                    : "Out of Stock"}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {isOwner ? (
              <View style={styles.ownerBadge}>
                <Text style={styles.ownerText}>Your Product</Text>
              </View>
            ) : (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={onChatPress}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.requestButton}
                  onPress={onRequestPress}
                >
                  <Text style={styles.button}>Request</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    width: 80,
    height: 80,
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  stockBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#10B981",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  stockText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  info: {
    flex: 1,
    marginLeft: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8B5CF6",
  },
  priceUnit: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 2,
  },
  actions: {
    marginLeft: 8,
  },
  ownerBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ownerText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  actionButtons: {
    alignItems: "center",
    gap: 15,
  },
  chatButton: {
    backgroundColor: "#6B7280",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  requestButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  button: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  statusContainer: { flexDirection: "row" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  availableBadge: { backgroundColor: "#D1FAE5" },
  outOfStockBadge: { backgroundColor: "#FEE2E2" },
  statusText: { fontSize: 12, fontWeight: "600" },
  availableText: { color: "#065F46" },
  outOfStockText: { color: "#991B1B" },
});

export default ProductCard;
