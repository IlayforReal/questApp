import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // You may need this for accessing Firebase Realtime Database
import { getAnalytics } from "firebase/analytics"; // Optional for analytics

const firebaseConfig = {
  apiKey: "AIzaSyCgnQk4JdodgYuXpKS10pWaiVEPvtbgIvk",
  authDomain: "questboard-5ccd2.firebaseapp.com",
  databaseURL: "https://questboard-5ccd2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "questboard-5ccd2",
  storageBucket: "questboard-5ccd2.firebasestorage.app",
  messagingSenderId: "632458874823",
  appId: "1:632458874823:web:0de58accbb1542541553e2",
  measurementId: "G-ERZ0WMEDTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optionally initialize Firebase Analytics
const analytics = getAnalytics(app);

// Optionally initialize Firebase Database
const db = getDatabase(app);

// Export app and db if needed
export { app, db };
