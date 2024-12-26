import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebase"; // Import Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase Authentication method

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message

  // Function to handle login
  const handleLogin = async () => {
    // Input validation
    if (!email || !password) {
      setErrorMessage("Both fields are required!");
      return;
    }

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store the Firebase token or user details in AsyncStorage if necessary
      await AsyncStorage.setItem("token", user.uid); // Store the user UID or other token

      router.replace("dashboard"); // Navigate to the dashboard after successful login
    } catch (error) {
      console.error("Login error:", error.code, error.message);

      // Handle different error cases based on Firebase error codes
      switch (error.code) {
        case "auth/invalid-email":
          setErrorMessage("Invalid email format.");
          break;
        case "auth/user-not-found":
          setErrorMessage("No account found with this email.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect password.");
          break;
        case "auth/invalid-credential":
          setErrorMessage("The provided credentials are invalid.");
          break;
        case "auth/missing-email":
          setErrorMessage("Email is required.");
          break;
        default:
          setErrorMessage("An unknown error occurred. Please try again.");
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.floatingContainer}>
        <Text style={styles.title}>Quest Board</Text>

        {/* Email input */}
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="email"
            size={20}
            color="#333"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Password input */}
        <View style={styles.inputContainer}>
          <FontAwesome6
            name="lock"
            size={20}
            color="#333"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Error Message */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {/* Forgot password link */}
        <View
          style={{
            marginTop: 10,
            fontSize: 14,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => router.push("recover")}>
            <Text style={[styles.recoverText, styles.link]}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Register link */}
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text style={styles.link} onPress={() => router.push("register")}>
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f3c73",
    paddingHorizontal: 20,
  },
  floatingContainer: {
    width: "90%",
    backgroundColor: "#cbd2da",
    padding: 30,
    borderRadius: 16,
    elevation: 10,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    marginTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0f3c73",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginBottom: 10,
    marginTop: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#0f3c73",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
    color: "black",
    marginTop: 30,
    textAlign: "center",
  },
  link: {
    color: "#3498db",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  iconSpacing: {
    marginHorizontal: 25,
    alignContent: "space-between",
  },
});

export default Login;
