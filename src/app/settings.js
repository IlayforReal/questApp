import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { updateProfile } from "firebase/auth";
import { ref, update } from "firebase/database";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth, db } from "../../firebase"; // Remove Firebase Storage import

const Settings = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState(""); // Replaced questPosition with bio
  const [profilePicture, setProfilePicture] = useState(""); // To store the local image URI
  const [loading, setLoading] = useState(false);

  // Ensure the user is loaded before interacting with the profile
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setName(user.displayName || "");
        setProfilePicture(user.photoURL || ""); // Load the existing photo URL
        
        // Retrieve bio from Realtime Database (or default to empty string)
        const userRef = ref(db, `users/${user.uid}`);
        userRef.once("value", (snapshot) => {
          const userData = snapshot.val();
          setBio(userData?.bio || ""); // Use existing bio if available
        });
      } else {
        Alert.alert("Error", "No user is logged in. Please log in again.");
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to pick an image but not upload it to Firebase
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "We need permission to access your photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfilePicture(result.assets[0].uri); // Only set the local image URI
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick an image. Please try again.");
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No user is logged in. Please log in again.");
      return;
    }

    if (!name) {
      Alert.alert("Validation Error", "Name cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      // Don't upload the image, just use the local URI or existing photo URL
      const photoURL = profilePicture || user.photoURL;

      // Update Firebase Auth profile with the photo URL
      await updateProfile(user, {
        displayName: name,
        photoURL, // Use the local URI or the existing photo URL
      });

      // Update Realtime Database with the new name, bio, and profile picture
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        name,
        bio, // Save the bio field in the database
        profilePicture: photoURL, // Save the local URI or existing URL in the database
      });

      // Reload user data to ensure UI updates
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
      setName(updatedUser.displayName || "");
      setProfilePicture(updatedUser.photoURL || "");

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message, error.stack);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {/* Profile Picture */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: profilePicture || "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png",
          }}
          style={styles.profilePicture}
        />
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="camera" size={30} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio} // Using the bio value here
        onChangeText={setBio} // Update the bio state
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Saving..." : "Save Changes"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Settings;
