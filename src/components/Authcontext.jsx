import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase'; // Import your Firebase auth instance
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    gender: '',
    email: '',
  });

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase Auth
      setCurrentUser(null); // Optionally clear local state
      localStorage.removeItem('currentUser'); // Clear any persisted data if needed
      resetUserData();  // Reset form data on logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Reset user data (form state)
  const resetUserData = () => {
    setUserData({
      firstName: '',
      lastName: '',
      contact: '',
      gender: '',
      email: '',
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout, userData, setUserData, resetUserData }}>
      {children}
    </AuthContext.Provider>
  );
}
