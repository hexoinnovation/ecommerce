import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase'; // Firebase auth instance
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
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

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        logout,
        userData,
        setUserData,
        resetUserData,
        isLoggedIn: Boolean(currentUser),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
