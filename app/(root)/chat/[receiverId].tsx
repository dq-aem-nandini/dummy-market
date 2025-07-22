import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getChatHistory } from "@/api/chat";
import { ChatMessage } from "@/api/types";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import {
  connectWebSocket,
  sendChatMessage,
  subscribeChatToMessages,
} from "@/api/websocket";

export default function ChatDetailScreen() {
  const { receiverId, receiverName, productId } = useLocalSearchParams<{
    receiverId: string;
    receiverName: string;
    productId: string;
  }>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      setCurrentUserId(userId);

      if (userId && receiverId && productId) {
        await fetchChatHistory(receiverId, productId);

        // Connect WebSocket
        connectWebSocket(() => {
          // Subscribe to this user's incoming messages
          subscribeChatToMessages(userId, (msg) => {
            const received = JSON.parse(msg.body);

            // Filter messages based on receiver & product
            if (
              received.senderId === receiverId &&
              received.productId === parseInt(productId)
            ) {
              setMessages((prev) => [...prev, received]);
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          });
        });
      }
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (partnerId: string, prodId: string) => {
    try {
      const history = await getChatHistory(partnerId);
      if (history && Array.isArray(history)) {
        // Sort messages by timestamp
        const sortedMessages = history.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sortedMessages);

        // Scroll to bottom after loading messages
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      // Initialize empty messages array on error
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !currentUserId) return;

    setSending(true);

    // Create new message object
    const message: ChatMessage = {
      id: Date.now(),
      senderId: currentUserId,
      receiverId: receiverId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      productId: parseInt(productId),
    };

    // Add message to local state immediately for better UX
    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      await sendChatMessage({
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        product: { id: parseInt(productId) },
      });
      console.log("Message sent:", message);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove message from local state if sending failed
      setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({
    item,
    index,
  }: {
    item: ChatMessage;
    index: number;
  }) => {
    const isCurrentUser = item.senderId === currentUserId;
    const showAvatar =
      !isCurrentUser &&
      (index === 0 || messages[index - 1]?.senderId !== item.senderId);

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {showAvatar && (
          <Image
            source={{
              uri:
                item.senderProfileImageUrl ||
                "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
            }}
            style={styles.messageAvatar}
          />
        )}

        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
            !showAvatar && !isCurrentUser && styles.messageBubbleNoAvatar,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isCurrentUser ? styles.currentUserText : styles.otherUserText,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isCurrentUser ? styles.currentUserTime : styles.otherUserTime,
            ]}
          >
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <SafeAreaView style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={() => router.push("/(root)/(tabs)/chat")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
            }}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerName}>{receiverName}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="call-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderInputArea = () => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          onPress={sendMessage}
          disabled={!newMessage.trim() || sending}
          style={[
            styles.sendButton,
            (!newMessage.trim() || sending) && styles.sendButtonDisabled,
          ]}
        >
          {sending ? (
            <LoadingSpinner size="sm" color="#FFFFFF" />
          ) : (
            <Ionicons name="send" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="lg" />
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {renderHeader()}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Start the conversation</Text>
            <Text style={styles.emptySubtitle}>
              Send a message to begin chatting about the product
            </Text>
          </View>
        }
      />

      {renderInputArea()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#8B5CF6",
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#E0E7FF",
  },
  headerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerStatus: {
    fontSize: 12,
    color: "#E0E7FF",
    marginTop: 2,
  },
  headerButton: {
    padding: 8,
  },
  messagesContainer: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 2,
    paddingHorizontal: 16,
  },
  currentUserMessage: {
    justifyContent: "flex-end",
  },
  otherUserMessage: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#E5E7EB",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageBubbleNoAvatar: {
    marginLeft: 40,
  },
  currentUserBubble: {
    backgroundColor: "#8B5CF6",
    borderBottomRightRadius: 6,
  },
  otherUserBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: "#FFFFFF",
  },
  otherUserText: {
    color: "#111827",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  currentUserTime: {
    color: "#E0E7FF",
    textAlign: "right",
  },
  otherUserTime: {
    color: "#9CA3AF",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: "#8B5CF6",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
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
