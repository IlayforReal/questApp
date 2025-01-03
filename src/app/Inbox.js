import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../firebase";
import { getAuth } from "firebase/auth";
import md5 from "md5";

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      setCurrentUserId(user.uid);
    } else {
      Alert.alert("Error", "User is not logged in.");
    }
  }, []);

  useEffect(() => {
    const db = getDatabase(app);
    const usersRef = ref(db, "users");

    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsers(data);
      }
    });

    return () => unsubscribeUsers();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      const db = getDatabase(app);
      const messagesRef = ref(db, "messages");

      const unsubscribe = onValue(
        messagesRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const conversationsData = [];

            Object.keys(data).forEach((conversationId) => {
              const conversationMessages = data[conversationId];
              let lastMessage = null;
              let otherUserName = null;
              let otherUserId = null;
              let otherUserProfilePic = null;

              Object.values(conversationMessages).forEach((message) => {
                if (!lastMessage || message.timestamp > lastMessage.timestamp) {
                  lastMessage = message;
                  otherUserId =
                    message.sender === currentUserId ? message.receiver : message.sender;
                  otherUserName =
                    message.sender === currentUserId ? message.receiver : message.sender;
                }
              });

              if (lastMessage && otherUserId) {
                otherUserProfilePic = users[otherUserId]?.profilePicture;

                conversationsData.push({
                  id: conversationId,
                  lastMessage: lastMessage.text,
                  otherUserName: otherUserName,
                  profilePicture: otherUserProfilePic,
                });
              }
            });

            setConversations(conversationsData);
          }
        },
        (error) => {
          Alert.alert("Error", "Failed to load conversations. Please try again.");
        }
      );

      return () => unsubscribe();
    }
  }, [currentUserId, users]);

  const openChat = (conversationId, otherUser) => {
    router.push({
      pathname: "/conversation",
      params: { conversationId, otherUser },
    });
  };

  const generateColorFromId = (id) => {
    const hash = md5(id);
    const color = "#" + hash.substr(0, 6);
    return color;
  };

  const renderProfilePicture = (profilePicture, userId, userName) => {
    if (profilePicture) {
      return <Image source={{ uri: profilePicture }} style={styles.profilePicture} />;
    }

    const color = generateColorFromId(userId);
    const initials = userName ? userName.charAt(0).toUpperCase() : userId.charAt(0).toUpperCase();

    return (
      <View style={[styles.profilePicture, { backgroundColor: color }]}>
        <Text style={styles.profilePictureText}>{initials}</Text>
      </View>
    );
  };

  const renderConversationItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => openChat(item.id, item.otherUserName)}
      >
        {renderProfilePicture(item.profilePicture, item.id, item.otherUserName)}

        <View style={styles.conversationDetails}>
          <Text style={styles.conversationName}>{item.otherUserName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || "Start a new conversation"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleHelpDesk = () => {
    Alert.alert("Help Desk", "Please contact support via email or our help center.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
        <TouchableOpacity style={styles.helpDeskButton} onPress={handleHelpDesk}>
          <Text style={styles.helpDeskButtonText}>Help Desk</Text>
        </TouchableOpacity>
      </View>

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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#F4F4F4",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    flex: 1,
  },
  helpDeskButton: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C4C4C4",
    elevation: 2,
  },
  helpDeskButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "400",
  },
  conversationList: {
    padding: 10,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePictureText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  conversationDetails: {
    marginLeft: 10,
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
    fontSize: 16,
  },
});

export default Inbox;
