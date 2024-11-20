// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore"; // Firestore

import { getAuth } from "firebase/auth"; // Firebase Authentication

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
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Firebase Authentication

// Export the instances
export { app, db, auth, doc, collection, setDoc, deleteDoc, getDocs };
