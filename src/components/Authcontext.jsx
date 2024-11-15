import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth,db} from './firebase'; // Firebase auth and firestore instances
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider
export function AuthProvider({ children }) {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser')) || null
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem('userData')) || {
      firstName: '',
      lastName: '',
      contact: '',
      gender: '',
      email: '',
    }
  );

  // Cart state
  const [cartCount, setCartCount] = useState(
    parseInt(localStorage.getItem('cartCount'), 10) || 0
  );

  // Monitor auth state changes and fetch cart count on login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Fetch user's cart count from Firestore
        
        const userCartRef = collection(db, 'users', user.email, 'AddToCart');
        const cartSnapshot = await getDocs(userCartRef);
        const count = cartSnapshot.size; // Get the count of items in the cart
        setCartCount(count); // Set cart count
        localStorage.setItem('cartCount', count); // Sync with localStorage
      } else {
        setCurrentUser(null);
        resetUserData();
        setCartCount(0); // Reset cart count on logout
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cartCount');
      }
    });
    return unsubscribe;
  }, []);

  // Sync userData with localStorage when it changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  // Sync cartCount with localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cartCount', cartCount);
  }, [cartCount]);

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      resetUserData();
      setCartCount(0); // Clear cart count on logout
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userData');
      localStorage.removeItem('cartCount');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Reset user data
  const resetUserData = () => {
    setUserData({
      firstName: '',
      lastName: '',
      contact: '',
      gender: '',
      email: '',
    });
  };

  // Cart-related functions
  const incrementCartCount = () => {
    setCartCount((prevCount) => prevCount + 1);
  };

  const decrementCartCount = () => {
    setCartCount((prevCount) => Math.max(0, prevCount - 1));
  };

  // Provide AuthContext to children components
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        logout,
        userData,
        setUserData,
        resetUserData,
        isLoggedIn: Boolean(currentUser),
        cartCount,
        incrementCartCount,
        decrementCartCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
