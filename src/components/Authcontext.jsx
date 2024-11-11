import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase'; // Your Firebase auth instance
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
    return unsubscribe;
  }, []);
  const logout = () => {
    // Clear authentication-related data
    setCurrentUser(null); // Reset the currentUser to null
    localStorage.removeItem('currentUser'); // Optionally clear from localStorage
  };
  
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
