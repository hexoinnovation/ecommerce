import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./firebase"; // Firebase auth and Firestore instances
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {
      firstName: "",
      lastName: "",
      contact: "",
      gender: "",
      email: "",
    }
  );

  // Cart state
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const [cartCount, setCartCount] = useState(
    parseInt(localStorage.getItem("cartCount"), 10) || 0
  );

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Sync cart from Firestore
        const userCartRef = collection(db, "users", user.email, "AddToCart");
        const unsubscribeCart = onSnapshot(userCartRef, (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCartItems(items);
          setCartCount(items.length); // Update cart count based on Firestore items
          localStorage.setItem("cartItems", JSON.stringify(items)); // Sync items with localStorage
          localStorage.setItem("cartCount", items.length); // Sync count with localStorage
        });

        return unsubscribeCart; // Cleanup Firestore listener
      } else {
        // Reset state for logged-out users
        setCurrentUser(null);
        resetUserData();
        setCartItems([]);
        setCartCount(0);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("cartCount");
        localStorage.removeItem("cartItems");
      }
    });

    return unsubscribe; // Cleanup auth listener
  }, []);

  // Sync cartItems with localStorage for guests
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("cartCount", cartItems.length); // Update count for guest users
    }
  }, [cartItems, currentUser]);

  // Sync userData with localStorage when it changes
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  // Add to cart
  const addToCart = async (product) => {
    if (currentUser) {
      // For logged-in users, check if the product already exists in Firestore
      const cartRef = doc(
        db,
        "users",
        currentUser.email,
        "AddToCart",
        product.id
      );
      const docSnap = await getDoc(cartRef);

      if (!docSnap.exists()) {
        // If the product doesn't exist, add it to Firestore
        await setDoc(cartRef, product);
      }

      // Update cart count and items
      const updatedCartItems = await getDocs(
        collection(db, "users", currentUser.email, "AddToCart")
      );
      const items = updatedCartItems.docs.map((doc) => doc.data());
      setCartItems(items); // Update state
      setCartCount(items.length); // Update count
      localStorage.setItem("cartItems", JSON.stringify(items)); // Sync with localStorage
      localStorage.setItem("cartCount", items.length); // Sync count
    } else {
      // For guest users, update local cart state
      setCartItems((prevCartItems) => {
        const existingItem = prevCartItems.find(
          (item) => item.id === product.id
        );
        if (!existingItem) {
          return [...prevCartItems, product];
        }
        return prevCartItems; // Don't add duplicate items
      });
    }
  };

  // Remove item from cart
  const removeFromCart = async (id) => {
    if (currentUser) {
      const cartRef = doc(db, "users", currentUser.email, "AddToCart", id);
      await deleteDoc(cartRef);

      // Update cart count and items
      const updatedCartItems = await getDocs(
        collection(db, "users", currentUser.email, "AddToCart")
      );
      const items = updatedCartItems.docs.map((doc) => doc.data());
      setCartItems(items); // Update state
      setCartCount(items.length); // Update count
      localStorage.setItem("cartItems", JSON.stringify(items)); // Sync with localStorage
      localStorage.setItem("cartCount", items.length); // Sync count
    } else {
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item.id !== id)
      );
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      resetUserData();
      setCartItems([]);
      setCartCount(0);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userData");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartCount");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Reset user data
  const resetUserData = () => {
    setUserData({
      firstName: "",
      lastName: "",
      contact: "",
      gender: "",
      email: "",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        logout,
        userData,
        setUserData,
        resetUserData,
        isLoggedIn: Boolean(currentUser),
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
