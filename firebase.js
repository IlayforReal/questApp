import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCgnQk4JdodgYuXpKS10pWaiVEPvtbgIvk",
  authDomain: "questboard-5ccd2.firebaseapp.com",
  databaseURL:
    "https://questboard-5ccd2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "questboard-5ccd2",
  storageBucket: "questboard-5ccd2.appspot.com",
  messagingSenderId: "632458874823",
  appId: "1:632458874823:web:0de58accbb1542541553e2",
  measurementId: "G-ERZ0WMEDTT",
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Get or initialize Firebase Auth
const auth =
  getAuth(app) ||
  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });

// Initialize Firebase Realtime Database
const database = getDatabase(app);

// Initialize Firestore
const firestore = getFirestore(app);

export { auth, database, firestore };
