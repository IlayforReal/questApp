import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../firebase";
import EvilIcons from "@expo/vector-icons/EvilIcons";

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const router = useRouter();

  // Simulated current user (replace with actual user logic)
  const currentUserId = "user123"; // Replace with logged-in user's ID

  // Fetch conversations from Firebase Realtime Database
  useEffect(() => {
    const db = getDatabase(app);
    const conversationsRef = ref(db, `conversations/${currentUserId}`);

    const unsubscribe = onValue(
      conversationsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const conversationList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setConversations(conversationList);
        }
      },
      (error) => {
        Alert.alert("Error", "Failed to load conversations. Please try again.");
      }
    );

    return () => unsubscribe();
  }, []);

  // Navigate to the chat screen for a specific conversation
  const openChat = (conversationId, otherUser) => {
    router.push({
      pathname: "/chat",
      params: { conversationId, otherUser },
    });
  };

  const renderConversationItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => openChat(item.id, item.otherUser)}
      >
        <EvilIcons name="user" size={30} color="#555" />
        <View style={styles.conversationDetails}>
          <Text style={styles.conversationName}>{item.otherUserName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || "Start a new conversation"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
      </View>

      {/* Conversation List */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversationItem}
        contentContainerStyle={styles.conversationList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No conversations yet.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  conversationList: { padding: 10 },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  conversationDetails: { marginLeft: 10, flex: 1 },
  conversationName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  lastMessage: { fontSize: 14, color: "#666" },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
    fontSize: 16,
  },
});

export default Inbox;
