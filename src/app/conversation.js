import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router'; // For accessing query params
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { app } from '../../firebase';
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Conversation = () => {
  const router = useRouter();
  const { conversationId, otherUser } = router.query; // Get conversationId and otherUser from the query

  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef(null);

  const database = getDatabase(app);
  const user = auth.currentUser;
  const userId = user ? user.uid : 'anonymous';

  // Fetch messages when the conversation ID is available
  useEffect(() => {
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    // Listen for messages in the conversation
    const messagesRef = ref(database, `messages/${conversationId}`);
    const messagesListener = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.values(data);
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
    });

    return () => {
      messagesListener();
    };
  }, [conversationId]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      text: newMessage,
      sender: user?.displayName || 'Anonymous',
      timestamp: new Date().toISOString(),
    };

    try {
      const messagesRef = ref(database, `messages/${conversationId}`);
      await push(messagesRef, message);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  // Auto-scroll to the bottom when a new message is added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{otherUser}</Text> {/* Display quest owner's name */}
      </View>
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.message,
                message.sender === userId ? styles.sentMessage : styles.receivedMessage,
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <FontAwesome name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  message: {
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#0078D4',
    padding: 10,
    borderRadius: 25,
  },
});

export default Conversation;
