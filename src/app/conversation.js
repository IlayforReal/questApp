import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router"; // Correct router from expo-router
import { getDatabase, ref, push, onValue } from "firebase/database";
import { app } from "../../firebase"; // Import your firebase app
import EvilIcons from "@expo/vector-icons/EvilIcons";

const Conversation = () => {
  const router = useRouter();
  const { questId, userId } = router.query; // Extract questId and userId from the query params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null); // Assuming you have a way to fetch current user's data
  const scrollViewRef = useRef(null); // Ref to control the ScrollView
  const [loading, setLoading] = useState(true); // Loading state for messages
  const [isReady, setIsReady] = useState(false); // To check if router.query is populated

  // Fetch current user data (replace with actual method, like Firebase Auth)
  useEffect(() => {
    const user = { id: "user123", name: "John Doe" }; // Replace with actual logic
    setCurrentUser(user);
  }, []);

  // Handle router query change
  useEffect(() => {
    if (questId && userId) {
      setIsReady(true); // Mark as ready when questId and userId are available
    }
  }, [questId, userId]);

  // Fetch messages for the specific questId and userId
  useEffect(() => {
    if (!isReady) return; // Only fetch messages if the component is ready (query params are available)

    const db = getDatabase(app);
    const messagesRef = ref(db, `conversations/${questId}/${userId}`);

    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messageList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          // Sort messages by timestamp
          messageList.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(messageList);
        }
        setLoading(false); // Set loading to false once messages are fetched
      },
      (error) => {
        Alert.alert("Error", "Failed to load messages. Please try again.");
        setLoading(false); // Set loading to false in case of an error
      }
    );

    return () => unsubscribe(); // Clean up when the component is unmounted
  }, [isReady, questId, userId]);

  // Handle sending a new message
  const sendMessage = () => {
    if (newMessage.trim() && currentUser) {
      const db = getDatabase(app);
      const messagesRef = ref(db, `conversations/${questId}/${userId}`);
      const newMessageRef = push(messagesRef);
      newMessageRef
        .set({
          message: newMessage,
          senderId: currentUser.id, // Assuming you have user info (id) stored
          timestamp: Date.now(),
        })
        .then(() => {
          setNewMessage(""); // Clear the message input after sending
        })
        .catch((error) => {
          Alert.alert("Error", "Failed to send message. Please try again.");
        });
    }
  };

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]); // Re-run when the messages state changes

  // Render the message bubble
  const renderMessage = (message) => {
    const isSent = message.senderId === currentUser?.id;
    return (
      <View
        key={message.id}
        style={[
          styles.messageBubble,
          isSent ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text style={styles.messageText}>{message.message}</Text>
        <Text style={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  // Check if questId or userId is missing
  if (!isReady) {
    return <Text>Loading conversation data...</Text>; // Show a loading message if query params are not yet available
  }

  // If loading is true, show a loading message
  if (loading) {
    return <Text>Loading messages...</Text>; // Display a loading message while waiting for messages
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <EvilIcons name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Conversation</Text>
        <View style={{ width: 30 }} /> {/* Empty space for alignment */}
      </View>

      <ScrollView
        contentContainerStyle={styles.messagesContainer}
        ref={scrollViewRef} // Attach the scrollViewRef
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages.map(renderMessage)}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <EvilIcons name="paper-plane" size={30} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesContainer: {
    padding: 10,
    paddingBottom: 60, // To prevent the keyboard from covering messages
  },
  messageBubble: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  sentMessage: {
    backgroundColor: "#28a745",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#d3d3d3",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Conversation;