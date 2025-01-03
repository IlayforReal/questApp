import { onAuthStateChanged } from "firebase/auth"; // Firebase listener
import { auth } from "../../../../firebase"; // Your Firebase auth config
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"; // Icon imports
import Ionicons from "@expo/vector-icons/Ionicons"; // Star icons
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons"; // Other icons

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null); // State to hold the user's profile data
  const [activeTab, setActiveTab] = useState("posts"); // For tab switching

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is logged in, update the profile data
        setUserProfile({
          name: user.displayName || "No name available", // Fetch the name from Firebase Authentication
          bio: "This is a placeholder bio", // Updated to bio field
          profilePicture:
            user.photoURL ||
            "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png", // Default profile picture if none
          questsDone: 52, // Replace with actual data
          followersCount: 200, // Replace with actual data
          followingCount: 380, // Replace with actual data
        });
      } else {
        // If no user is logged in, you can handle this scenario, e.g., show a login screen
        setUserProfile(null);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const posts = [
    {
      id: 1,
      image:
        "https://premiumwp.com/wp-content/uploads/2009/02/best-portfolio-photography-wordpress-themes.jpg",
    },
    {
      id: 2,
      image:
        "https://img.freepik.com/premium-psd/portfolio-gallery-website-design_69089-26.jpg",
    },
    {
      id: 3,
      image:
        "https://tse4.mm.bing.net/th?id=OIP.ovKjq9UnQ8Ve1suPTj8EmgHaLG&pid=Api&P=0&h=180",
    },
    {
      id: 4,
      image:
        "https://tse3.mm.bing.net/th?id=OIP.IxYlEBgYmcZbwcI_L2AN6AHaEo&pid=Api&P=0&h=180",
    },
    {
      id: 5,
      image:
        "https://tse1.mm.bing.net/th?id=OIP.uRZsqT4ClofTkLP3EqaWIgHaFj&pid=Api&P=0&h=180",
    },
    {
      id: 6,
      image:
        "https://tse2.mm.bing.net/th?id=OIP.0UTeZ4tx6lWDRoTgq821EAHaHa&pid=Api&P=0&h=180",
    },
    {
      id: 7,
      image:
        "https://tse1.mm.bing.net/th?id=OIP.WSmVj4WqhlRUt_m7MpPNXQHaE7&pid=Api&P=0&h=180",
    },
    {
      id: 8,
      image:
        "https://tse2.mm.bing.net/th?id=OIF.IX72ZndtQXzB0ojfRHiinw&pid=Api&P=0&h=180",
    },
    {
      id: 9,
      image:
        "https://i.fbcd.co/products/original/e92d60e15544a3bba087b0db450fd4a554f16bb1453e68e71453ac5be6fb2098.jpg",
    },
  ];

  const rates = [
    {
      questGiver: 1,
      questGiverName: "Joana R",
      rate: 5,
      date: "03 Sep 2024",
      comment: "Great service, very professional!",
    },
    {
      questGiver: 2,
      questGiverName: "Jonnavien Grace A",
      rate: 4,
      date: "20 Aug 2024",
      comment: "Impressive job!",
    },
    {
      questGiver: 3,
      questGiverName: "Jules F",
      rate: 4,
      date: "05 Aug 2024",
      comment: "Amazing work, highly recommend.",
    },
    {
      questGiver: 4,
      questGiverName: "Shiela M",
      rate: 3,
      date: "30 Jul 2024",
      comment: "Good, but could improve communication.",
    },
  ];

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={12} color="#f1c40f" />
      );
    }
    if (rating % 1 !== 0) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color="#f1c40f" />
      );
    }
    while (stars.length < 5) {
      stars.push(
        <Ionicons
          key={`empty-${stars.length}`}
          name="star-outline"
          size={12}
          color="#f1c40f"
        />
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: userProfile.profilePicture }}
          style={styles.profilePicture}
        />
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <MaterialIcons
              name="verified"
              size={20}
              color="#0f3c73"
              style={styles.verifiedIcon}
            />
          </View>
          <View style={styles.positionRankContainer}>
            <Text style={styles.userPosition}>{userProfile.bio}</Text> {/* Updated to bio */}
            <Text style={styles.userRank}>{userProfile.rank}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>{userProfile.questsDone}</Text>
          <Text style={styles.statLabel}>Quest Done</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>{userProfile.followersCount}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>{userProfile.followingCount}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <View style={styles.postsContainer}>
        <View style={styles.postsHeader}>
          <TouchableOpacity onPress={() => toggleTab("posts")}>
            <Text
              style={[styles.postsTitle, activeTab === "posts" && styles.activeTab]}
            >
              Portfolio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleTab("rates")}>
            <Text
              style={[styles.postsTitle, activeTab === "rates" && styles.activeTab]}
            >
              Rates
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "posts" && (
          <View style={styles.grid}>
            {posts.map((post) => (
              <Image
                key={post.id}
                source={{ uri: post.image }}
                style={styles.gridImage}
              />
            ))}
          </View>
        )}

        {activeTab === "rates" && (
          <View style={styles.ratesList}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>4.5</Text>
              <Text style={styles.rateStar}>★★★★☆</Text>
            </View>
            <Text style={styles.feedbackTitle}>Client Feedback</Text>
            {rates.map((rate) => (
              <View key={rate.questGiver} style={styles.rateItem}>
                <View style={styles.questGiverContainer}>
                  <Ionicons
                    name="person-circle-outline"
                    size={20}
                    color="black"
                    style={styles.userIcon}
                  />
                  <Text style={styles.questGiverName}>
                    {rate.questGiverName}
                  </Text>
                </View>
                <View style={styles.ratingAndDateContainer}>
                  <View style={styles.ratingContainer}>
                    {renderStars(rate.rate)}
                  </View>
                  <Text style={styles.rateDate}>{rate.date}</Text>
                </View>
                <Text>{rate.comment}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileContainer: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  positionRankContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userPosition: {
    fontSize: 14,
    color: "#888",
    marginRight: 10,
  },
  userRank: {
    fontSize: 14,
    color: "#888",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statItem: {
    alignItems: "center",
  },
  statCount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
  },
  postsContainer: {
    padding: 15,
  },
  postsHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  postsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 20,
  },
  activeTab: {
    color: "#0f3c73",
    borderBottomWidth: 2,
    borderBottomColor: "#0f3c73",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridImage: {
    width: "48%",
    height: 150,
    marginBottom: 10,
  },
  ratesList: {
    marginTop: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5,
  },
  rateStar: {
    fontSize: 16,
    color: "#f1c40f",
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  rateItem: {
    marginBottom: 15,
  },
  questGiverContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  userIcon: {
    marginRight: 5,
  },
  questGiverName: {
    fontWeight: "bold",
  },
  ratingAndDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  rateDate: {
    fontSize: 12,
    color: "#888",
  },
});

export default Profile;
