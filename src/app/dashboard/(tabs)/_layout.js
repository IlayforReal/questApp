import React from "react";
import { Tabs } from "expo-router";
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",
        tabBarActiveBackgroundColor: "#ceced5",
        tabBarLabelStyle: {
          fontSize: 13,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={30}
              color="black"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="upload"
        options={{
          title: "Post",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={30}
              color="black"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "bell-badge" : "bell-badge-outline"}
              size={30}
              color="black"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={30}
              color="black"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default DashboardLayout;
