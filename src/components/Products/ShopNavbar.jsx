import React, { useEffect, useRef, useState } from "react";
import { FaThList, FaBars, FaTimes, FaChevronRight, FaChevronLeft } from "react-icons/fa"; // Import icons

import {
  MoonIcon,
  SunIcon,
  ShoppingCartIcon,
  UserIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  CogIcon,
  LogoutIcon,
} from "@heroicons/react/solid"; // Importing icons from Heroicons
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa"; // Importing icons
import {doc, setDoc, getDoc,getFirestore } from "firebase/firestore";
// //import {
  
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
import {  useNavigate } from "react-router-dom";
import { useAuth } from "../Authcontext";
import CartPage from '../Cart/CartPage';
import CartDrawer from '../Navbar/CartDrawer';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase"; // Your firebase configuration
const ShopNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // For login dropdown
  const [isDarkMode, setIsDarkMode] = useState(false); // For dark mode toggle

  // Toggle theme between dark and light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  const [showModal, setShowModal] = useState(false); // Initially set to false

  // Toggle modal visibility
  const handleModalToggle = () => {
    handleDropdownClick();
    setShowModal(!showModal); // Toggle modal visibility
  };
  // Close modal
  const closeModal = () => {
    setShowModal(false); // Close the modal by setting showModal to false
  };
 // Toggle login dropdown
 const toggleLoginDropdown = () => {
  setDropdownOpen(!dropdownOpen);
};
const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to manage drawer visibility

const toggleDrawer = () => {
  setIsDrawerOpen(!isDrawerOpen); // Toggle the drawer open/close
};
const [isCartDrawerOpen, setCartDrawerOpen] = useState(false); // State to manage the drawer visibility

// Function to open the cart drawer
const toggleCartDrawer = () => {
  setCartDrawerOpen(!isCartDrawerOpen);
};
const dropdownRef = useRef(null);
const { cartCount } = useAuth(); // Access cartCount from context
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState('');  // Add state for error message
  const [successMessage, setSuccessMessage] = useState(''); // Success message
  //const db = getFirestore(app);
  const auth = getAuth(app);
  const db = getFirestore(app);
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const storedUsername = localStorage.getItem("username");

    if (authStatus === "true") {
      setIsAuthenticated(true);
      setUsername(storedUsername); // Load the username from localStorage
    }
  }, []);

  const handleSignup = async () => {
    setError("");
    setSuccessMessage("");

    if (!email || !password || !username) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save the username in Firestore during signup
      const userDocRef = doc(db, "users", email);
      await setDoc(userDocRef, {
        email: user.email,
        username: username, // Set the provided username
        createdAt: new Date(),
        lastLogin: new Date(),
      });

      setSuccessMessage("Account created successfully! Please log in.");
      setIsSignup(false); // Switch to login form
    } catch (error) {
      console.error("Signup Error: ", error); // Log error
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  const handleLogin = async () => {
    setError(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Log in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if the user document exists in Firestore
      const userDocRef = doc(db, "users", user.email); // Use user.email as the ID
      const userDocSnap = await getDoc(userDocRef);

      let fetchedUsername = ""; // Default to empty string

      if (userDocSnap.exists()) {
        // If user document exists, get the username from Firestore
        const userData = userDocSnap.data();
        fetchedUsername = userData.username || "Default Username"; // Fallback to 'Default Username'
      } else {
        // If no user document exists, create one with a default username
        fetchedUsername = "Default Username"; // Default username for new users
        await setDoc(userDocRef, {
          email: user.email,
          username: fetchedUsername, // Store default username
          createdAt: new Date(),
          lastLogin: new Date(),
        });
      }

      // Set user data to state
      setUsername(fetchedUsername);
      setIsAuthenticated(true);

      setSuccessMessage("Login successful!");
      setShowModal(false); // Close modal after login

      // Store authentication state and username in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", fetchedUsername);
      localStorage.setItem("userEmail", user.email); // Optionally store email as well
    } catch (error) {
      console.error("Login Error: ", error);
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  // Close the login dropdown when clicking any menu item
  const handleDropdownClick = () => {
    setDropdownOpen(false); // Close the login dropdown
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown if click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const navigate = useNavigate();
  const handleAccountClick = () => {
    navigate("/account"); // Navigate to the account page when "My Account" is clicked
  };
  const { logout, resetUserData } = useAuth();

  const handleLogout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");

    if (isConfirmed) {
      await logout(); // Log out user from Firebase
      resetUserData(); // Reset form data
      alert("Logout successful! Please login to access your details.");
      // Clear localStorage on logout to reset the session
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("username");
      localStorage.removeItem("userEmail");
      // Update the state to reflect that the user is logged out
      setIsAuthenticated(false); // Set isAuthenticated to false
      setDropdownOpen(false); // Close the dropdown after logout
    }
  };
 
  return (
    <div>
      {/* Upper Navbar */}
      <nav className="bg-primary/55 text-black dark:bg-gray-900 dark:text-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2">
          {/* Left Side (Toggle Menu and Logo) */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold ml-10 sm:ml-0">Hexo</span>
            </div>
          </div>

          {/* Desktop View - Search Bar and Icons */}
          <div className="hidden lg:flex items-center space-x-4 w-full justify-center">
            <div className="flex items-center space-x-2 flex-grow max-w-3xl">
              <input
                type="text"
                className="w-full py-2 px-4 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white"
                placeholder="Search for products, brands, and more"
              />
              <button className="bg-primary/40 text-black px-4 py-2 rounded-r-md hover:bg-primary hover:text-white dark:text-black dark:bg-white dark:hover:bg-primary/40 dark:hover:text-white">
                Search
              </button>
            </div>
          </div>
  {/* Right Side (Login, Cart, Theme Toggle, Admin Icon) */}
  <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  className="text-black dark:text-white font-semibold flex items-center space-x-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown on click
                >
                  {isAuthenticated ? (
                    <span>{username}</span> // Display the username if logged in
                  ) : (
                    <span>Login</span> // Display "Login" if not authenticated
                  )}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown when authenticated */}
                {dropdownOpen && isAuthenticated && (
                  <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-md py-2">
                    <button onClick={handleAccountClick} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <UserCircleIcon className="w-5 h-5 mr-2" />
                      My Account
                    </button>
                    <button className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <ShoppingBagIcon className="w-5 h-5 mr-2" />
                      My Orders
                    </button>
                    <button className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <ShoppingCartIcon className="w-5 h-5 mr-2" />
                      My Wishlist
                    </button>
                    <button className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <CogIcon className="w-5 h-5 mr-2" />
                      Settings
                    </button>
                    <button onClick={handleLogout} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LogoutIcon className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </div>
                )}

                {/* Dropdown when not authenticated */}
                {dropdownOpen && !isAuthenticated && (
                  <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-md py-2">
                    <button className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={handleModalToggle}>
                      <UserCircleIcon className="w-5 h-5 mr-2" />
                      Login
                    </button>
                    <button onClick={handleAccountClick} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <UserCircleIcon className="w-5 h-5 mr-2" />
                      My Account
                    </button>
                    <button className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <ShoppingBagIcon className="w-5 h-5 mr-2" />
                      My Orders
                    </button>
                    <button className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <ShoppingCartIcon className="w-5 h-5 mr-2" />
                      My Wishlist
                    </button>
                    <button className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <CogIcon className="w-5 h-5 mr-2" />
                      Settings
                    </button>
                    <button onClick={handleLogout} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LogoutIcon className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
              <button className="text-black dark:text-white" onClick={toggleCartDrawer}>
                <ShoppingCartIcon className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-28 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}

              </button>
              {/* Drawer for Cart */}
              {/* Cart Drawer */}
              <CartDrawer
                isOpen={isCartDrawerOpen}
                closeDrawer={toggleCartDrawer} // Function to close the drawer when clicked outside or when user clicks the close button
              />

            {/* Admin Icon (replaced with User Icon for now) */}
            <button className="text-black dark:text-white">
              <UserIcon className="w-6 h-6" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="text-black dark:text-white"
            >
              {isDarkMode ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>
     
      {showModal &&
        !isAuthenticated && ( // Only show modal when showModal is true and user is not authenticated
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-10 rounded-lg w-96 shadow-lg relative">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>

              <h2 className="text-3xl mb-6 text-center font-bold text-gray-800 font-serif">
                {isSignup ? "Sign Up" : " Login"}
              </h2>

              {/* Display Success or Error Message */}
              {successMessage && (
                <p className="text-green-500 text-center">{successMessage}</p>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}

              {/* Login or Signup Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  isSignup ? handleSignup() : handleLogin();
                }}
              >
                {/* Email Field */}
                <div className="mb-6">
                  <div className="relative">
                    <FaUser className="absolute left-3 top-4 text-black-400" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-black"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <FaUser className="absolute left-3 top-4 text-black-400" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-black"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-6">
                  <div className="relative">
                    <FaLock className="absolute left-3 top-4 text-black-400" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-black"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-600 text-white p-3 rounded-lg flex items-center justify-center space-x-2"
                >
                  <FaSignInAlt />
                  <span>{isSignup ? "Sign Up" : "Login"}</span>
                </button>
              </form>
              {/* Switch to Sign Up / Login */}
              <p className="text-sm mt-4 text-center text-gray-600">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsSignup(false)}
                      className="text-blue-500 hover:underline"
                    >
                      Login
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsSignup(true)}
                      className="text-blue-500 hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

export default ShopNavbar;
