import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getReceivedNotifications,
  respondToNotification,
} from "@/api/services";
import { useApi } from "@/hooks/useApi";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { clearBadge } from "@/store/badgeSlice";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useDarkMode } from "@/app/context/DarkModeContext";

export default function SalesScreen() {
  const { colors } = useDarkMode();
  const dispatch = useDispatch();
  const { response, loading, error, refetch } = useApi(
    getReceivedNotifications,
    { immediate: true }
  );

  const receivedNotifications = response?.response ?? [];
  const [refreshing, setRefreshing] = React.useState(false);
  const pendingRequests = receivedNotifications.filter(
    (item) => item.requestStatus === "PENDING"
  );
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Clear sales badge when screen is focused
  useFocusEffect(
    useCallback(() => {
      dispatch(clearBadge('sales'));
    }, [dispatch])
  );

  const handleViewSalesDetails = (item: any) => {
    router.push({
      pathname: "/(root)/profile/SalesDetails",
      params: {
        buyerName: String(item.buyerName ?? ""),
        productName: String(item.productName ?? ""),
        quantity: String(item.desiredQuantity ?? ""),
        pricePerKg: String(item.desiredPricePerKg ?? ""),
        requestStatus: item.requestStatus,
        sellAt: String(item.sellAt ?? ""),
      },
    });
  };
  const handleRespond = async (id: number, status: "ACCEPTED" | "REJECTED") => {
    try {
      await respondToNotification(id, status);
      Alert.alert("Success", `Request ${status.toLowerCase()} successfully`, [
        { text: "OK" },
      ]);
      refetch();
    } catch (error) {
      console.error("Error responding:", error);
      Alert.alert("Error", "Failed to update request status");
    }
  };

  const handleContactBuyer = (
    buyerId: string,
    buyerName: string,
    productId: number
  ) => {
    router.push({
      pathname: "/(root)/chat/[receiverId]",
      params: {
        receiverId: buyerId,
        productId: productId.toString(),
        receiverName: buyerName,
      },
    });
  };
  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
      <SafeAreaView>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.headerText }]}>
              Sales Requests
            </Text>
            <Text style={[styles.headerSubtitle, { color: `${colors.headerText}CC` }]}>
              {pendingRequests.length} pending request
              {pendingRequests.length !== 1 ? "s" : ""}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.headerText }]}>
                {receivedNotifications.length}
              </Text>
              <Text style={[styles.statLabel, { color: `${colors.headerText}CC` }]}>
                Total
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );

  const renderRequestItem = ({ item, index }: { item: any; index: number }) => {
    const status = item.requestStatus || item.status || "PENDING";
    const totalAmount = (item.desiredQuantity * item.desiredPricePerKg).toFixed(
      2
    );

    return (
      <TouchableOpacity
        onPress={() => handleViewSalesDetails(item)}
        activeOpacity={0.9}
      >
        <View style={[styles.requestCard, { backgroundColor: colors.surface }]}>
          <View style={styles.requestHeader}>
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: colors.text }]}>
                {item.productName || `Product #${item.productId}`}
              </Text>
              <Text style={[styles.buyerName, { color: colors.textSecondary }]}>
                Request from {item.buyerName || "Unknown Buyer"}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                status === "ACCEPTED"
                  ? styles.acceptedBadge
                  : status === "REJECTED"
                  ? styles.rejectedBadge
                  : styles.pendingBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  status === "ACCEPTED"
                    ? styles.acceptedText
                    : status === "REJECTED"
                    ? styles.rejectedText
                    : styles.pendingText,
                ]}
              >
                {status}
              </Text>
            </View>
          </View>

          <View style={styles.requestDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="scale-outline" size={16} color="#6B7280" />
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Quantity
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {item.desiredQuantity} kg
                </Text>
                  {item.desiredQuantity} kg
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="cash-outline" size={16} color="#6B7280" />
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Price
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  ₹{item.desiredPricePerKg}/kg
                </Text>
              </View>
            </View>

            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Total Amount:
              </Text>
              <Text style={[styles.totalAmount, { color: colors.primary }]}>
                ₹{totalAmount}
              </Text>
            </View>
          </View>

          {/* {status === "PENDING" && (
          <View style={styles.actionButtons}>
            <Button
              title="Reject"
              variant="outline"
              size="sm"
              onPress={() => handleRespond(item.id, "REJECTED")}
              style={[styles.actionButton, styles.rejectButton]}
              textStyle={styles.rejectButtonText}
            />
            <Button
              title="Accept"
              size="sm"
              onPress={() => handleRespond(item.id, "ACCEPTED")}
              style={[styles.actionButton, styles.acceptButton]}
            />
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContactBuyer(item.buyerId, item.buyerName, item.productId)}
            >
              <Ionicons name="chatbubble-outline" size={16} color="#8B5CF6" />
              <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>
          </View>
        )} */}
          {status === "PENDING" && (
            <View className="flex-row gap-2 items-center mt-2">
              <TouchableOpacity
                className="px-4 py-2 border border-red-500 rounded-md"
                onPress={() => handleRespond(item.id, "REJECTED")}
              >
                <Text className="text-red-500 font-semibold text-sm">
                  Reject
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-4 py-2 bg-green-600 rounded-md"
                onPress={() => handleRespond(item.id, "ACCEPTED")}
              >
                <Text className="text-white font-semibold text-sm">Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-1 px-3 py-2 border border-purple-500 rounded-md"
                onPress={() =>
                  handleContactBuyer(
                    item.buyerId,
                    item.buyerName,
                    item.productId
                  )
                }
              >
                <Ionicons name="chatbubble-outline" size={16} color="#8B5CF6" />
                <Text className="text-purple-600 font-medium text-sm">
                  Contact
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <LoadingSpinner size="lg" />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading sales requests...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={[styles.errorText, { color: colors.text }]}>
          Failed to load requests
        </Text>
        {/* <Button title="Retry" onPress={refetch} /> */}
        <TouchableOpacity
          onPress={refetch}
          className="mt-4 px-6 py-2 bg-blue-600 rounded-md self-center"
        >
          <Text className="text-white font-semibold text-base text-center">
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={receivedNotifications}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        renderItem={renderRequestItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No sales requests
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              When buyers request your products, they'll appear here
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  statsContainer: {
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 100,
  },
  requestCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  buyerName: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  pendingBadge: {
    backgroundColor: "#FEF3C7",
  },
  acceptedBadge: {
    backgroundColor: "#D1FAE5",
  },
  rejectedBadge: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  pendingText: {
    color: "#92400E",
  },
  acceptedText: {
    color: "#065F46",
  },
  rejectedText: {
    color: "#991B1B",
  },
  requestDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    marginLeft: 6,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  rejectButton: {
    borderColor: "#EF4444",
  },
  rejectButtonText: {
    color: "#EF4444",
  },
  acceptButton: {
    backgroundColor: "#10B981",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8B5CF6",
    marginTop: 8,
  },
  contactButtonText: {
    color: "#8B5CF6",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    marginVertical: 16,
    textAlign: "center",
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 40,
    marginHorizontal: 20,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
});
