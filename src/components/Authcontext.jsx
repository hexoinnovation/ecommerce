import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase'; // Firebase auth instance
import { onAuthStateChanged, signOut } from 'firebase/auth';

// AuthContext and CartContext
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

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        setCurrentUser(null);
        resetUserData();
        localStorage.removeItem('currentUser');
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
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userData');
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

  // Providing both AuthContext and CartContext
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
