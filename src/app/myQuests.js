import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { app } from "../../firebase"; // Import the initialized app from firebase.js
import { getAuth } from "firebase/auth"; // Import Firebase Auth

const MyQuests = () => {
  const [quests, setQuests] = useState([]);
  const [editTask, setEditTask] = useState(null); // State to store task being edited
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");

  // Fetch current user's ID from Firebase Authentication
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      setCurrentUserId(user.uid); // Set the current user's ID
    }
  }, []);

  // Fetch quests from Firebase
  useEffect(() => {
    if (!currentUserId) return; // Don't fetch quests if the currentUserId is not set

    const db = getDatabase(app);
    const questsRef = ref(db, "quests"); // Reference to the "quests" data path in Firebase

    // Listen for changes to quests data
    const unsubscribe = onValue(questsRef, (snapshot) => {
      const data = snapshot.val();
      const questList = [];

      // Map through the data and push to questList array
      for (let key in data) {
        const quest = {
          id: key,
          ...data[key],
        };

        // Only include quests that belong to the current user
        if (quest.userId === currentUserId) {
          questList.push(quest);
        }
      }

      // Update state with filtered data
      setQuests(questList);
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, [currentUserId]);

  // Handle Delete Task
  const handleDelete = (taskId) => {
    const db = getDatabase(app);
    const taskRef = ref(db, `quests/${taskId}`); // Corrected string interpolation

    // Remove task from Firebase
    remove(taskRef)
      .then(() => {
        // Remove task from local state
        setQuests(quests.filter((task) => task.id !== taskId));
        Alert.alert("Success", "Task deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        Alert.alert("Error", "Failed to delete the task.");
      });
  };

  // Handle Update Task
  const handleUpdate = () => {
    if (!updatedTitle || !updatedContent) {
      Alert.alert("Error", "Please fill out both the title and content.");
      return;
    }

    const db = getDatabase(app);
    const taskRef = ref(db, `quests/${editTask.id}`); // Corrected string interpolation

    // Update task in Firebase
    update(taskRef, {
      title: updatedTitle,
      content: updatedContent,
    })
      .then(() => {
        // Update local state with new task details
        setQuests(
          quests.map((task) =>
            task.id === editTask.id
              ? { ...task, title: updatedTitle, content: updatedContent }
              : task
          )
        );
        setEditTask(null); // Close the edit mode
        setUpdatedTitle("");
        setUpdatedContent("");
        Alert.alert("Success", "Task updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        Alert.alert("Error", "Failed to update the task.");
      });
  };

  return (
    <View style={styles.container}>
      {/* Edit task modal or section */}
      {editTask && (
        <View style={styles.editSection}>
          <TextInput
            style={styles.input}
            placeholder="Update Title"
            value={updatedTitle}
            onChangeText={setUpdatedTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Update Content"
            value={updatedContent}
            onChangeText={setUpdatedContent}
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update Task</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setEditTask(null)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for tasks..."
          placeholderTextColor="#888"
        />
        <EvilIcons
          name="search"
          size={25}
          color="black"
          style={styles.searchIcon}
        />
      </View>

      <View style={styles.filterContainer}>
        {/* Filter buttons */}
        {/* Add filter buttons here */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.taskContainer}>
          {quests.length === 0 ? (
            <Text style={styles.noTasksText}>No tasks found</Text>
          ) : (
            quests.map((task) => (
              <View key={task.id} style={styles.taskBox}>
                <View style={styles.row}>
                  <EvilIcons name="user" size={25} color="black" />
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  {/* Dynamically render the price/amount */}
                  <Text style={styles.taskPrice}>Php {task.amount}</Text>
                </View>
                <Text style={styles.taskLabel}>{task.content}</Text>

                {/* Edit and Delete buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setEditTask(task);
                      setUpdatedTitle(task.title);
                      setUpdatedContent(task.content);
                    }}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(task.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cbd2da",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 10,
    height: 35,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 9,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: "110%",
    fontSize: 15,
  },
  searchIcon: {
    marginLeft: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  taskContainer: {
    marginTop: 10,
  },
  taskBox: {
    backgroundColor: "white",
    width: "100%",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "white",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  taskLabel: {
    fontSize: 15,
    color: "grey",
    flexShrink: 1,
    marginTop: 5,
  },
  taskTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "gray",
    flex: 1,
    marginRight: 10,
  },
  taskPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c7c2c",
  },
  filterContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  editSection: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  updateButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end", // Aligns buttons to the right
    alignItems: "center", // Ensures vertical alignment if needed
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10, // Space between the buttons
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  noTasksText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MyQuests;
