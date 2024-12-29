import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Replace with your actual Firebase configuration values
const firebaseConfig = {
  apiKey: "AIzaSyCgnQk4JdodgYuXpKS10pWaiVEPvtbgIvk",  // Your API key
  authDomain: "questboard-5ccd2.firebaseapp.com",  // Your Auth domain
  databaseURL: "https://questboard-5ccd2-default-rtdb.asia-southeast1.firebasedatabase.app",  // Your Database URL
  projectId: "questboard-5ccd2",  // Your Project ID
  storageBucket: "questboard-5ccd2.appspot.com",  // Your Storage Bucket
  messagingSenderId: "632458874823",  // Your Messaging Sender ID
  appId: "1:632458874823:web:0de58accbb1542541553e2",  // Your App ID
  measurementId: "G-ERZ0WMEDTT",  // Your Measurement ID (if applicable)
};

// Initialize Firebase App only if it's not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with persistence
const auth = getAuth(app) || initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // For persistence across app restarts
});

// Initialize Firebase Realtime Database
const db = getDatabase(app);

// Initialize Firestore (Optional if needed)
const firestore = getFirestore(app);

export { auth, db, firestore };