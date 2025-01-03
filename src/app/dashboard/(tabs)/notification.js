import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { getDatabase, ref, onValue, remove, update, push } from "firebase/database";
import { app } from "../../../../firebase"; // Import the initialized app from firebase.js
import { getAuth } from "firebase/auth"; // For getting the current user
import { useRouter } from "expo-router"; // For navigation

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [isQuestGiver, setIsQuestGiver] = useState(null); // To track if the user is quest giver or taker

  useEffect(() => {
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    // Check if the user is a quest giver or taker by fetching the user's data or role
    setIsQuestGiver(true); // Set this based on your database or user data

    const db = getDatabase(app);
    const notificationsRef = ref(db, "notifications");

    // Listen for changes to notifications data
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      const notificationsList = [];

      // Filter notifications based on whether the user is a quest giver or taker
      for (let key in data) {
        if (isQuestGiver && data[key].ownerId === user?.uid) {
          notificationsList.push({
            id: key,
            ...data[key],
          });
        } else if (!isQuestGiver && data[key].userId === user?.uid) {
          notificationsList.push({
            id: key,
            ...data[key],
          });
        }
      }

      setNotifications(notificationsList);
    });

    return () => unsubscribe();
  }, [isQuestGiver, user]);

  const handleAccept = (notification) => {
    const db = getDatabase(app);
    const notificationRef = ref(db, `notifications/${notification.id}`);

    // Update the notification status to accepted
    update(notificationRef, {
      status: "Accepted",
    });

    // Create a private conversation ID
    const conversationId = `${user.uid}-${notification.userId}`;

    // Redirect to the conversation page with the quest taker
    router.push({
      pathname: `/conversation`,
      query: { conversationId, otherUser: notification.userName },
    });

    // Notify the quest taker about the acceptance
    sendNotificationToTaker(notification.userId, `${user.displayName} accepted your request to take the quest.`);
  };

  const handleDecline = (notification) => {
    const db = getDatabase(app);
    const notificationRef = ref(db, `notifications/${notification.id}`);

    // Delete the notification from the quest giver's end
    remove(notificationRef);

    // Notify the quest taker about the decline
    sendNotificationToTaker(notification.userId, `${user.displayName} declined your request to take the quest.`);
  };

  const sendNotificationToTaker = (takerId, message) => {
    const db = getDatabase(app);
    const notificationsRef = ref(db, "notifications");

    // Send a notification to the quest taker with the provided message
    push(notificationsRef, {
      userId: takerId,
      userName: user.displayName, // Quest giver's name
      status: "Notification",
      message: message,
      date: new Date().toISOString(), // Optional: to track the date of notification
    });
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationBox}>
      <Text style={styles.userName}>{item.userName}</Text>
      <Text style={styles.notificationText}>
        {isQuestGiver
          ? `is interested in your quest: ${item.questTitle}`
          : item.message}
      </Text>
      <Text style={styles.notificationStatus}>Status: {item.status}</Text>
      {isQuestGiver && item.status === "Pending" && (
        <View style={styles.buttonContainer}>
          <Button title="Accept" onPress={() => handleAccept(item)} />
          <Button title="Decline" onPress={() => handleDecline(item)} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text>No notifications found.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  notificationBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#007bff",
    marginBottom: 5,
  },
  notificationText: {
    fontSize: 14,
    color: "gray",
  },
  notificationStatus: {
    fontSize: 12,
    color: "green",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default Notification;
