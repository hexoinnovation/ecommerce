// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxC5szU2_EhzF1ihiTBW80unDvWOmOEgg",
  authDomain: "ecommerce-a8bf0.firebaseapp.com",
  projectId: "ecommerce-a8bf0",
  storageBucket: "ecommerce-a8bf0.appspot.com",

  messagingSenderId: "841860124930",
  appId: "1:841860124930:web:8c7fc937a73d90e3d7721b",
  measurementId: "G-ZLB7S1QFFR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Firebase Authentication

// Export the instances
export { app, analytics, db, auth }; // Export auth (Firebase Authentication), db (Firestore)
