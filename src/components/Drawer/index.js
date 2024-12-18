import React from 'react';
import { useRouter } from 'expo-router';
import { Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const DrawerContent = () => {
  const router = useRouter();

  // Logout function - to handle logout
  const handleLogout = () => {
    // Clear any relevant session or state here
    console.log('Logging out...');
    router.push('/Login'); // Redirect to the Login screen
  };

  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/women/3.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Avril Mahinay</Text>
        <Text style={styles.profilePosition}>Quest Taker</Text>
      </View>

      {/* Inbox */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push('/Message')}
      >
        <FontAwesome6 name="message" size={22} color="black" />
        <Text style={styles.drawerText}>Inbox</Text>
      </TouchableOpacity>

      {/* Track My Quests */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push('/myQuests')}
      >
        <FontAwesome5 name="list" size={22} color="black" />
        <Text style={styles.drawerText}>Track My Quests</Text>
      </TouchableOpacity>

      {/* Settings */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push('/Settings')}
      >
        <Ionicons name="settings-outline" size={24} color="#333" />
        <Text style={styles.drawerText}>Settings</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.drawerItem, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Icon name="logout" size={24} color="#333" />
        <Text style={styles.drawerText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: '#cbd2da', // Background color for profile section
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profilePosition: {
    fontSize: 14,
    color: '#666',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  drawerText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20, // Distance from the bottom of the screen
    left: 15,   // Align with other drawer items
    right: 15,  // Maintain padding consistency
  },
});

export default DrawerContent;
