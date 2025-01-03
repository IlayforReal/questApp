import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
  Alert, // Import Alert API
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { getDatabase, ref, onValue, push } from "firebase/database";
import { app } from "../../../../firebase"; // Import the initialized app from firebase.js
import { useRouter } from "expo-router"; // Import useRouter for navigation
import { getAuth } from "firebase/auth"; // For getting the current user

const Home = () => {
  const [quests, setQuests] = useState([]); // State to store quests
  const [selectedQuest, setSelectedQuest] = useState(null); // State to store selected quest details
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [selectedCategory, setSelectedCategory] = useState("ALL"); // State for the selected category
  const router = useRouter(); // Router instance for navigation
  const auth = getAuth(); // Firebase auth instance to get the current user

  const categories = [
    "ALL",
    "Personal",
    "Event Assistant",
    "Printing",
    "Pick-up & Delivery",
    "Lost & Found",
    "Tutoring",
  ];

  useEffect(() => {
    const db = getDatabase(app);
    const questsRef = ref(db, "quests");

    const unsubscribe = onValue(questsRef, (snapshot) => {
      const data = snapshot.val();
      const questList = [];
      for (let key in data) {
        questList.push({
          id: key,
          ...data[key],
        });
      }
      setQuests(questList);
    });

    return () => unsubscribe();
  }, []);

  const filteredQuests = quests.filter((task) => {
    const searchText = searchQuery.toLowerCase();
    const taskTitle = task.title ? task.title.toLowerCase() : "";
    const taskContent = task.content ? task.content.toLowerCase() : "";

    const matchesSearch = taskTitle.includes(searchText) || taskContent.includes(searchText);
    const matchesCategory =
      selectedCategory === "ALL" || task.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSelectQuest = (quest) => {
    setSelectedQuest(quest);
  };

  const closeDetailsModal = () => {
    setSelectedQuest(null);
  };

  const handleInterested = (quest) => {
    const db = getDatabase();
    const notificationsRef = ref(db, "notifications");
    const user = auth.currentUser;
    const userName = user ? user.displayName : "Unknown User";

    if (quest.userId !== user?.uid) {
      push(notificationsRef, {
        questId: quest.id,
        questTitle: quest.title,
        userId: user ? user.uid : "guest",
        userName: userName,
        status: "Pending",
        ownerId: quest.userId,
      });

      // Show alert to confirm the action
      Alert.alert(
        "Interest Sent",
        `You have expressed interest in "${quest.title}". The quest owner will be notified.`,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") },
          { text: "View Notifications", onPress: () => router.push("/Notifications") },
        ]
      );
    } else {
      Alert.alert("Action Not Allowed", "You can't express interest in your own quest!");
    }
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for tasks..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <EvilIcons name="search" size={25} color="black" style={styles.searchIcon} />
      </View>

      {/* Category buttons */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, selectedCategory === category && styles.selectedCategoryButton]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[styles.categoryText, selectedCategory === category && styles.selectedCategoryText]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
                onPress={() => handleSelectQuest(task)}
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
        <Modal visible={true} transparent={true} animationType="fade" onRequestClose={closeDetailsModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedQuest.title}</Text>
              <Text style={styles.modalContent}>{selectedQuest.content}</Text>
              <Text style={styles.modalPrice}>Php {selectedQuest.amount}</Text>
              {selectedQuest.category && <Text style={styles.modalDetails}>Category: {selectedQuest.category}</Text>}
              {selectedQuest.skillRequired && (
                <Text style={styles.modalDetails}>Skill Required: {selectedQuest.skillRequired}</Text>
              )}
              {selectedQuest.deadline && <Text style={styles.modalDetails}>Deadline: {selectedQuest.deadline}</Text>}
              <TouchableOpacity style={styles.closeButton} onPress={closeDetailsModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.interestedButton} onPress={() => handleInterested(selectedQuest)}>
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
  categoryContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 2,
  },
  categoryButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: "#2c7c2c",
  },
  categoryText: {
    color: "gray",
    fontWeight: "bold",
  },
  selectedCategoryText: {
    color: "white",
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalPrice: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2c7c2c",
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  interestedButton: {
    backgroundColor: "#2c7c2c",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  interestedButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Home;
