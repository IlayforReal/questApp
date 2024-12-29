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
import { getDatabase, ref, set, push } from "firebase/database";
import { app } from "../../../../firebase"; // Import the initialized app from firebase.js
import DateTimePicker from "@react-native-community/datetimepicker"; // Import the DateTimePicker component
import { getAuth } from "firebase/auth"; // Import Firebase Auth

const Upload = () => {
  const [postContent, setPostContent] = useState(""); // For task content
  const [skillRequired, setSkillRequired] = useState(""); // For skill required
  const [deadline, setDeadline] = useState(""); // For deadline
  const [amount, setAmount] = useState(""); // For amount
  const [category, setCategory] = useState(""); // For category selection
  const [loading, setLoading] = useState(false); // For button state
  const [showDatePicker, setShowDatePicker] = useState(false); // To show/hide the calendar picker
  const [referenceNumber, setReferenceNumber] = useState(""); // For reference number

  const transactionFee = 18; // Transaction fee
  const gCashAccount = "09063671975"; // GCash account number

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;

    const today = new Date().toISOString().split("T")[0]; // Current date in "YYYY-MM-DD"
    const selectedDateString = selectedDate.toISOString().split("T")[0]; // Format selected date as "YYYY-MM-DD"

    if (selectedDateString < today) {
      Alert.alert("Invalid Date", "The deadline must be today or in the future.");
      setDeadline(today); // Set to today's date
    } else {
      setDeadline(selectedDate.toLocaleDateString()); // Set the selected date as the deadline
    }

    setShowDatePicker(false); // Close the date picker after selection
  };

  const handleAmountChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, ""); // Only allow digits
    setAmount(numericText); // Update the amount
  };

  const handlePost = async () => {
    if (!postContent.trim() || !skillRequired.trim() || !deadline.trim() || !amount.trim() || !category.trim() || !referenceNumber.trim()) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    if (parseInt(amount) < 50) {
      Alert.alert("Error", "The amount must be at least 50 pesos!");
      return;
    }

    const referenceNumberRegex = /^\d{13}$/; // Regex to match a 13-digit number
    if (!referenceNumberRegex.test(referenceNumber.trim())) {
      Alert.alert("Error", "GCash reference number must be exactly 13 digits!");
      return;
    }

    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    const displayName = user.displayName || "Anonymous"; // Default to "Anonymous" if displayName is not set
    const userId = user.uid; // Get the current user's UID

    setLoading(true); // Start loading indicator
    const db = getDatabase(app);
    const newQuestRef = push(ref(db, "quests"));

    try {
      const questId = newQuestRef.key;

      await set(newQuestRef, {
        content: postContent.trim(),
        skillRequired: skillRequired.trim(),
        deadline: deadline.trim(),
        amount: amount.trim(),
        category: category.trim(),
        createdAt: new Date().toISOString(),
        status: "pending",
        displayName: displayName,
        userId: userId,
        questId: questId,
        referenceNumber: referenceNumber.trim(),
      });

      Alert.alert(
        "Success",
        "Your quest has been submitted successfully! It will be reviewed by the Admin, and you will be notified once the review is complete."
      );

      setPostContent("");
      setSkillRequired("");
      setDeadline("");
      setAmount("");
      setCategory("");
      setReferenceNumber("");
    } catch (err) {
      Alert.alert("Error", err.message);
      console.error("Error saving data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Post Quest</Text>

        <TextInput
          style={styles.input}
          placeholder="Post a task..."
          placeholderTextColor="#888"
          multiline
          height={150}
          numberOfLines={10}
          value={postContent}
          onChangeText={setPostContent}
        />

        <Text style={styles.label}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {[
            "Personal",
            "Event Assistant",
            "Printing",
            "Pick-up & Delivery",
            "Lost & Found",
            "Tutoring",
          ].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterBox,
                category === cat && styles.selectedCategory,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={styles.label}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Skill required</Text>
          <TextInput
            style={styles.input}
            placeholder="Skill required"
            placeholderTextColor="#888"
            value={skillRequired}
            onChangeText={setSkillRequired}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Deadline for completion</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="Select deadline"
              placeholderTextColor="#888"
              value={deadline}
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#888"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reference Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter reference number"
            placeholderTextColor="#888"
            value={referenceNumber}
            onChangeText={setReferenceNumber}
          />
        </View>

        <Text style={styles.totalAmount}>
          Total amount to be paid: ₱{parseInt(amount || 0) + transactionFee}
        </Text>
        <Text style={styles.gCashInfo}>GCash Account: {gCashAccount}</Text>

        <TouchableOpacity
          style={[styles.postButton, loading && { opacity: 0.5 }]}
          onPress={handlePost}
          disabled={loading}
        >
          <Text style={styles.postButtonText}>
            {loading ? "Saving..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cbd2da",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0f3c73",
    paddingHorizontal: 5,
    marginBottom: 20,
    textAlign: "left",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "grey",
    padding: 15,
    fontSize: 16,
    color: "black",
    textAlignVertical: "top",
    marginBottom: 5,
    elevation: 3,
  },
  filterContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  filterBox: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCategory: {
    backgroundColor: "#0f3c73", // Highlight background
    borderColor: "#0f3c73", // Border color for selected category
  },
  inputContainer: {
    width: "100%",
    marginBottom: 1,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    textAlign: "left",
  },
  totalAmount: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    textAlign: "left",
    fontWeight: "bold",
  },
  gCashInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    textAlign: "left",
    fontWeight: "bold",
  },
  postButton: {
    backgroundColor: "#0f3c73",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  postButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Upload;
