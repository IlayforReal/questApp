import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../../../firebase"; // Import the initialized app from firebase.js
import { useRouter } from "expo-router"; // Import useRouter for navigation

const Home = () => {
  const [quests, setQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null); // State to store selected quest details
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const router = useRouter(); // Router instance for navigation

  // Fetch quests from Firebase
  useEffect(() => {
    const db = getDatabase(app);
    const questsRef = ref(db, "quests"); // Reference to the "quests" data path in Firebase

    // Listen for changes to quests data
    const unsubscribe = onValue(questsRef, (snapshot) => {
      const data = snapshot.val();
      const questList = [];

      // Map through the data and push to questList array
      for (let key in data) {
        questList.push({
          id: key,
          ...data[key],
        });
      }

      // Update state with fetched data
      setQuests(questList);
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once

  // Function to filter quests based on search query
  const filteredQuests = quests.filter((task) => {
    const searchText = searchQuery.toLowerCase();
    const taskTitle = task.title ? task.title.toLowerCase() : "";
    const taskContent = task.content ? task.content.toLowerCase() : "";

    return taskTitle.includes(searchText) || taskContent.includes(searchText);
  });

  // Handle selecting a quest
  const handleSelectQuest = (quest) => {
    setSelectedQuest(quest);
  };

  // Handle closing the details modal
  const closeDetailsModal = () => {
    setSelectedQuest(null);
  };

  // Navigate to conversation page when "Interested" button is pressed
  const handleInterested = (quest) => {
    router.push({
      pathname: "/conversation", // Directly referencing the conversation file in the same directory
      query: { questId: quest.id, userId: quest.userId }, // Pass quest ID and user ID to the conversation page
    });
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for tasks..."
          placeholderTextColor="#888"
          value={searchQuery} // Bind to the searchQuery state
          onChangeText={(text) => setSearchQuery(text)} // Update the search query as user types
        />
        <EvilIcons
          name="search"
          size={25}
          color="black"
          style={styles.searchIcon}
        />
      </View>

      {/* Quest list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.taskContainer}>
          {filteredQuests.length === 0 ? (
            <Text>No tasks found.</Text>
          ) : (
            filteredQuests.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskBox}
                onPress={() => handleSelectQuest(task)} // Open quest details on click
              >
                <View style={styles.row}>
                  <EvilIcons name="user" size={25} color="black" />
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskPrice}>Php {task.amount}</Text>
                </View>
                <Text style={styles.taskLabel}>{task.content}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal for quest details */}
      {selectedQuest && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={closeDetailsModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedQuest.title}</Text>
              <Text style={styles.modalContent}>{selectedQuest.content}</Text>
              <Text style={styles.modalPrice}>Php {selectedQuest.amount}</Text>

              {/* Displaying additional details */}
              {selectedQuest.category && (
                <Text style={styles.modalDetails}>
                  Category: {selectedQuest.category}
                </Text>
              )}
              {selectedQuest.skillRequired && (
                <Text style={styles.modalDetails}>
                  Skill Required: {selectedQuest.skillRequired}
                </Text>
              )}
              {selectedQuest.deadline && (
                <Text style={styles.modalDetails}>
                  Deadline: {selectedQuest.deadline}
                </Text>
              )}

              {/* Close button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeDetailsModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

              {/* Interested button */}
              <TouchableOpacity
                style={styles.interestedButton}
                onPress={() => handleInterested(selectedQuest)}
              >
                <Text style={styles.interestedButtonText}>Interested</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    color: "#2c7c2c",
    marginBottom: 20,
  },
  modalDetails: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#000",
  },
  interestedButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  interestedButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default Home;
