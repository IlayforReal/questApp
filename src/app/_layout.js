import React from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

const headerStyle = {
  backgroundColor: "#0f3c73",
  headerTintColor: "white",
};

const RootLayout = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            animation: "none",
            headerStyle, // Apply the default headerStyle
            headerTintColor: "white", // Consistent header text color
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen name="register" options={{ title: "Registration" }} />

          <Stack.Screen
            name="recover"
            options={{ title: "Recover Password" }}
          />

          <Stack.Screen name="reset" options={{ title: "Reset Password" }} />

          <Stack.Screen name="set" options={{ title: "Set New Password" }} />

          <Stack.Screen name="complete" options={{ title: "Complete" }} />

          <Stack.Screen name="dashboard" options={{ headerShown: false }} />

          <Stack.Screen
            name="account"
            options={{ title: "Account Information" }}
          />

          <Stack.Screen
            name="verification"
            options={{ title: "ID Verification" }}
          />

          {/* Instead of component prop, use direct routing for MyQuests */}
          <Stack.Screen name="myQuests" options={{ title: "My Quests" }} />

          <Stack.Screen
            name="conversation"
            options={{ title: "Conversation" }}
          />
        </Stack>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default RootLayout;
