import {
  faBox,
  faCogs,
  faCreditCard,
  faHeart,
  faUser,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import Navbar from "./Navbar";
import { auth, db } from '../firebase'; // Make sure to initialize Firebase in your project
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc,  updateDoc } from 'firebase/firestore';
import { PencilIcon } from "@heroicons/react/solid";
const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: faUser },
    { id: "personal", label: "Personal Information", icon: faCogs },
    { id: "address", label: "Manage Address", icon: faBox },
    { id: "password", label: "Change Password", icon: faHeart },
    { id: "payment", label: "Payment Methods", icon: faCreditCard },
    { id: "orders", label: "Order History", icon: faClipboardList },
    { id: "wishlist", label: "Wishlist", icon: faHeart },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null); // Store the image as a base64 string
  const [base64Image, setBase64Image] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Check if the user is logged in
  useEffect(() => {
    // Subscribe to the auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If logged in, fetch user data and set it
        setUserData({
          username: user.displayName || 'Username not set',
          email: user.email,
        });
        setIsAuthenticated(true); // Set authenticated state to true
      } else {
        // If not logged in, set userData to null
        setUserData(null);
        setIsAuthenticated(false); // Set authenticated state to false
      }
      setLoading(false); // Stop loading once the check is complete
    });


    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64String = reader.result.toString();
        setBase64Image(base64String);

        const userDocRef = doc(db, "users", email);
        await setDoc(
          userDocRef,
          {
            profileImage: base64String,
          },
          { merge: true }
        );

        console.log("Image successfully saved!");
      } catch (error) {
        console.error("Error saving image:", error);
      }
    };

    reader.onerror = () => {
      console.error("Error reading file.");
    };

    reader.readAsDataURL(file);
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="bg-gradient-to-br from-yellow-700 to-orange-400 text-white rounded-lg p-6 shadow-lg lg:w-1/4">
            <div className="text-center mb-8">
            <div className="relative inline-block">
            <img
              src={base64Image || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto object-cover"
            />
            <label
              htmlFor="image-upload"
              className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1 cursor-pointer hover:bg-gray-300"
            >
              <PencilIcon className="h-5 w-5 text-gray-600" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          {isAuthenticated ? (
        // If authenticated, show username
        <h2 className="text-xl font-semibold mt-2">{userData.username}</h2>
      ) : (
        // If not authenticated, show "Not Logged In" and email
        <div>
          <h2 className="text-xl font-semibold mt-2">Not Logged In</h2>
          <p className="text-sm">{userData ? userData.email : "No Email"}</p>
        </div>
      )}
            </div>
            <nav>
              <ul className="space-y-4">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full text-left py-2 px-4 rounded-lg flex items-center gap-4 ${
                        activeTab === tab.id
                          ? "bg-white text-blue-600 shadow-md"
                          : "text-gray-200 hover:bg-white hover:text-blue-600 transition"
                      }`}
                    >
                      <FontAwesomeIcon icon={tab.icon} />
                      <span>{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Dashboard */}
          <main className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {activeTab === "overview" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Account Overview
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Welcome to your account dashboard. Here, you can manage your
                  personal details, address, payment methods, orders, and
                  wishlist.
                </p>
              </div>
            )}
            {activeTab === "personal" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Personal Information
                </h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full p-3 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border rounded-md"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full p-3 border rounded-md"
                    />
                    <select className="w-full p-3 border rounded-md">
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    className="w-full p-3 border rounded-md"
                  />
                  <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                    Save Changes
                  </button>
                </form>
              </div>
            )}
            {activeTab === "address" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Manage Address</h2>
                <form className="space-y-4">
                  <textarea
                    placeholder="Address Line 1"
                    className="w-full p-3 border rounded-md"
                  />
                  <textarea
                    placeholder="Address Line 2"
                    className="w-full p-3 border rounded-md"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full p-3 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Zip Code"
                      className="w-full p-3 border rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                  <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
                    Save Address
                  </button>
                </form>
              </div>
            )}
            {activeTab === "password" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
                <form className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full p-3 border rounded-md"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-3 border rounded-md"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full p-3 border rounded-md"
                  />
                  <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition">
                    Change Password
                  </button>
                </form>
              </div>
            )}
            {activeTab === "payment" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Payment Methods</h2>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full p-3 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Expiration Date (MM/YY)"
                    className="w-full p-3 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-full p-3 border rounded-md"
                  />
                  <button className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition">
                    Save Payment Method
                  </button>
                </form>
              </div>
            )}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Order History</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  View your past orders and track your recent purchases.
                </p>
                {/* Add dynamic order history content */}
              </div>
            )}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Wishlist</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Manage your favorite products here.
                </p>
                {/* Add dynamic wishlist content */}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountPage;
