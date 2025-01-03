import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Text, StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";

const DrawerContent = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "Guest",
          profilePicture:
            currentUser.photoURL ||
            "https://randomuser.me/api/portraits/women/3.jpg", // Default image if no profile photo exists
          bio: currentUser.bio || "No bio available", // Assuming bio is available in the user's profile
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      console.log("Logged out successfully");
      router.replace("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  if (!user) {
    return (
      <DrawerContentScrollView contentContainerStyle={styles.container}>
        <Text>Loading user info...</Text>
      </DrawerContentScrollView>
    );
  }

  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user.profilePicture }} // Use the profile picture URI from user object
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileBio}>{user.bio}</Text> {/* Bio instead of position */}
      </View>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push("/Inbox")}
      >
        <Icon name="inbox" size={22} color="black" />
        <Text style={styles.drawerText}>Inbox</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push("/myQuests")}
      >
        <FontAwesome5 name="list" size={22} color="black" />
        <Text style={styles.drawerText}>Track My Quests</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push("/settings")}
      >
        <Ionicons name="settings-outline" size={24} color="#333" />
        <Text style={styles.drawerText}>Settings</Text>
      </TouchableOpacity>

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
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: "#cbd2da", // Adjust as per design preference
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileBio: {
    fontSize: 14,
    color: "#666", // Adjust bio color if needed
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  drawerText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 15,
  },
});

export default DrawerContent;
