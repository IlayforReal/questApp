import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../firebase"; // Import Firebase auth
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Import Firebase Authentication method
import { getDatabase, ref, set } from "firebase/database";
import app from "../../firebase";
import DateTimePicker from "@react-native-community/datetimepicker";

const Register = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bday, setBday] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._-]+@ustp\.edu\.ph$/.test(email);
  const validatePhoneNumber = (phoneNumber) => /^\d{11}$/.test(phoneNumber);
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

  const validateBday = (bday) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Format: YYYY-MM-DD
    if (!dateRegex.test(bday)) return false;
    const enteredDate = new Date(bday);
    const today = new Date();
    const age = today.getFullYear() - enteredDate.getFullYear();
    const ageCheck =
      today < new Date(enteredDate.setFullYear(today.getFullYear()))
        ? age - 1
        : age;
    return ageCheck >= 18;
  };

  const saveData = async (userUID) => {
    const db = getDatabase(app);
    const userRef = ref(db, "users/" + userUID);

    try {
      await set(userRef, {
        firstName,
        lastName,
        bday,
        phoneNumber,
        email,
      });

      Alert.alert("Registration successful");
      router.push("/"); // Navigate to login page after successful registration
    } catch (error) {
      console.error("Error writing to database:", error);
      Alert.alert("Error saving data", error.message);
    }
  };

  const handleRegister = async () => {
    const validationErrors = {};

    if (
      !firstName ||
      !lastName ||
      !bday ||
      !phoneNumber ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      validationErrors.general = "Please fill in all fields";
    }
    if (password !== confirmPassword) {
      validationErrors.password = "Passwords do not match!";
    }
    if (!validateEmail(email)) {
      validationErrors.email = "Please enter a valid ustp.edu.ph email";
    }
    if (!validatePhoneNumber(phoneNumber)) {
      validationErrors.phoneNumber = "Please enter a valid phone number";
    }
    if (!validatePassword(password)) {
      validationErrors.passwordStrength =
        "Password should be at least 6 characters long and contain both letters and numbers";
    }
    if (!validateBday(bday)) {
      validationErrors.bday =
        "You must enter a valid date (YYYY-MM-DD) and be at least 18 years old";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      await saveData(user.uid);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message || "Error during registration");
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || bday;
    setShowDatePicker(false);
    setBday(currentDate.toISOString().split("T")[0]); // Formatting date as YYYY-MM-DD
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.floatingContainer}>
          <Text style={styles.title}>Create an Account</Text>

          <View style={styles.nameContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Birthday (YYYY-MM-DD)"
                value={bday}
                editable={false}
              />
            </TouchableOpacity>
            {errors.bday && <Text style={styles.errorText}>{errors.bday}</Text>}

            {showDatePicker && (
              <DateTimePicker
                value={new Date(bday || Date.now())}
                mode="date"
                onChange={onDateChange}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            {errors.passwordStrength && (
              <Text style={styles.errorText}>{errors.passwordStrength}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.link} onPress={() => router.push("/")}>
              Login
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  floatingContainer: {
    width: "90%",
    backgroundColor: "#cbd2da",
    padding: 30,
    borderRadius: 16,
    elevation: 10,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    marginTop: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "102%",
    marginBottom: 20,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 10,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "white",
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#0f3c73",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#3498db",
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
    color: "#333",
    marginTop: 40,
    marginBottom: 40,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default Register;
