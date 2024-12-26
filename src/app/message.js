import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';

const Message = () => {

  const router = useRouter();

  const messages = [
    { id: '1', text: 'Hello Maam, I would like to accept the quest you posted.', sender: 'user' },
    { id: '2', text: 'Hello, thank you for accepting my quest', sender: 'other' },
    { id: '3', text: 'I would like to have more information on the quest Maam.', sender: 'user' },
    { id: '4', text: 'I will be sending you the details.', sender: 'other' },
    { id: '5', text: 'Hello Maam, I would like to accept the quest you posted.', sender: 'user' },
    { id: '6', text: 'Hello, thank you for accepting my quest', sender: 'other' },
    { id: '7', text: 'I would like to have more information on the quest Maam.', sender: 'user' },
    { id: '8', text: 'I will be sending you the details.', sender: 'other' },
    { id: '9', text: 'I would like to have more information on the quest Maam.', sender: 'user' },
    { id: '10', text: 'I will be sending you the details.', sender: 'other' },
  ];

  const userProfile = {
    name: "Avril Mahinay",
    profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
    lastActiveTime: "5 minutes ago", 
    status: "offline", 
  };

  return (
    <View style={styles.container}>

      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: userProfile.profilePicture }} 
          style={styles.profilePicture}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.statusText}>
            {userProfile.status === "online" ? `Online` : `Offline - ${userProfile.lastActiveTime}`}
          </Text>
        </View>
 
        <View style={styles.iconsContainer}>
          <Ionicons name="call" size={18} color="black" style={styles.icon} />
          <FontAwesome5 name="video" size={18} color="black" style={styles.icon} />
          <Entypo name="dots-three-horizontal" size={20} color="black" />
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === 'user' ? styles.userMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          editable={true} 
        />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 10,
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    color: '#888',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
    marginRight:20,
  },
  messagesList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e1e1e1',
  },
  messageText: {
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 10,
    elevation: 2,
    marginTop: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    marginLeft: 10,
  },
});

export default Message;