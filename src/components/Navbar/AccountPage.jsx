import {
  faBox,
  faCogs,
  faCreditCard,
  faHeart,
  faUser,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import { FaLock ,FaMapMarked, FaUser,FaCreditCard,FaCalendarAlt,FaHeart} from 'react-icons/fa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import Navbar from "./Navbar";
import { auth, db } from '../firebase'; // Make sure to initialize Firebase in your project
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc,  updateDoc,setDoc, } from 'firebase/firestore';
import { PencilIcon } from "@heroicons/react/solid";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom'; 
import { useNavigate } from "react-router-dom";
import Notiflix from 'notiflix';
const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate(); 
  const tabs = [
    { id: "overview", label: "Overview", icon: faUser },
    { id: "personal", label: "Personal Information", icon: faCogs },
    { id: "address", label: "Manage Address", icon: faBox },
    { id: "password", label: "Change Password", icon: faHeart },
    { id: "payment", label: "Payment Methods", icon: faCreditCard },
    { id: "orders", label: "Order History", icon: faClipboardList },
    //{ id: "wishlist", label: "Wishlist", icon: faHeart },
    
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
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [username, setUsername] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentData, setPaymentData] = useState(null); 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true); // Set loading to true while fetching data
  
      if (user) {
        setIsAuthenticated(true);
        setEmail(user.email);
  
        try {
          // Fetch user data from Firestore
          const userDocRef = doc(db, 'users', user.email);
          const userDocSnap = await getDoc(userDocRef);
  
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserData(userData);
  
            // Fetch current password (this is just an example, and storing passwords in Firestore directly is not recommended)
            setCurrentPassword(userData.password || ''); // Set current password
  
            // Fetch other user details (name, phone, etc.)
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setPhoneNumber(userData.phoneNumber || '');
            setGender(userData.gender || '');
            setDob(userData.dob || '');
            setUsername(userData.username || 'Username not set');
  
            // Fetch address data if exists
            const addressData = userData.address || {};
            setAddressLine1(addressData.addressLine1 || '');
            setAddressLine2(addressData.addressLine2 || '');
            setCity(addressData.city || '');
            setState(addressData.state || '');
            setZipCode(addressData.zipCode || '');
            setCountry(addressData.country || '');
  
            // Fetch payment details if they exist
            const paymentData = userData.payment || {};
            setCardNumber(paymentData.cardNumber || '');
            setExpirationDate(paymentData.expirationDate || '');
            setCvc(paymentData.cvc || '');
  
            // Fetch profile image if exists
            const profileRef = doc(userDocRef, 'profile', 'profile_image');
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
              setBase64Image(profileSnap.data().image); // Set profile image if it exists
            }
          } else {
            Notiflix.Notify.failure('User not found.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Notiflix.Notify.failure('Failed to fetch user data.');
        }
      } else {
        // If user is not authenticated, reset state
        setIsAuthenticated(false);
        setUserData(null);
        setBase64Image(null);
        setCurrentPassword(''); // Reset password
      }
  
      setLoading(false); // Set loading to false after fetching data
    });
  
    // Clean up the subscription on component unmount
    return unsubscribe;
  }, []);
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64String = reader.result.toString();
        setBase64Image(base64String);

        if (userData) {
          const userDocRef = doc(db, "users", userData.email);
          const profileRef = doc(userDocRef, "profile", "profile_image");
          await setDoc(
            profileRef,
            { image: base64String },
            { merge: true }
          );
          console.log("Image successfully saved!");
        }
      } catch (error) {
        console.error("Error saving image:", error);
      }
    };

    reader.readAsDataURL(file);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-r-4 border-b-4 border-l-4 border-transparent border-t-red-500 border-r-green-500 border-b-blue-500 border-l-yellow-500"></div>
      </div>
    );
  }
  
  const togglePasswordVisibility = (field) => {
    if (field === 'current') {
      setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
    } else if (field === 'new') {
      setIsNewPasswordVisible(!isNewPasswordVisible);
    } else if (field === 'confirm') {
      setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    }
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set the active tab when clicked
    if (tab === "wishlist") {
      navigate("/wishlist"); // Redirect to /wishlist route when wishlist tab is clicked
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Save button clicked!");
  
    // Check if email is provided
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Email is required!',
      });
      return;
    }
  
    // Collect payment details
    const paymentData = {
      cardNumber: cardNumber, // Add state for cardNumber
      expirationDate: expirationDate, // Add state for expiration date
      cvc: cvc, // Add state for CVC
    };
  
    // Collect user info and address data
    const addressData = {
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
    };
  
    const userData = {
      username,
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      dob,
      address: addressData, // Add address as a nested object
      payment: paymentData, // Add payment details
    };
  
    const userDocRef = doc(db, 'users', email);
  
    try {
      // Save user and address data to Firestore under the same user document
      await setDoc(userDocRef, userData, { merge: true });
  
      // Show success notification
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'User, address, and payment data saved successfully!',
      });
    } catch (error) {
      console.error('Error saving user data: ', error); // Log error to console
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong while saving data.',
      });
    }
  };
  

  const handleChangePassword = async (e) => {
    e.preventDefault();
  
    if (!currentPassword || !newPassword || !confirmPassword) {
      Notiflix.Notify.failure('All fields are required.', {
        timeout: 4000,
        position: 'right-top',
        cssAnimationStyle: 'fade',
        showOnlyTheLastOne: true,
      });
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Notiflix.Notify.failure('New password and confirm password do not match.', {
        timeout: 4000,
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const userDocRef = doc(db, 'users', email); // Replace email with the logged-in user's email
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
  
        if (userData.password !== currentPassword) {
          Notiflix.Notify.failure('Current password is incorrect.', {
            timeout: 4000,
          });
          setLoading(false);
          return;
        }
  
        await updateDoc(userDocRef, { password: newPassword });
  
        setLoading(false);
        Notiflix.Notify.success('Password updated successfully!', {
          timeout: 4000,
        });
      } else {
        Notiflix.Notify.failure('User not found.', {
          timeout: 4000,
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Notiflix.Notify.failure('Failed to update password. Please try again later.', {
        timeout: 4000,
      });
      console.error(error);
    }
  };
  
  // useEffect(() => {
  //   const fetchCurrentPassword = async () => {
  //     try {
  //       const userDocRef = doc(db, 'users', email); // Replace email with the logged-in user's email
  //       const userDocSnap = await getDoc(userDocRef);

  //       if (userDocSnap.exists()) {
  //         const userData = userDocSnap.data();
  //         setCurrentPassword(userData.password || ''); // Fetch and set the current password
  //       } else {
  //         Notiflix.Notify.failure('User not found.', {
  //           timeout: 4000,
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Error fetching current password:', error);
  //       Notiflix.Notify.failure('Failed to fetch current password.', {
  //         timeout: 4000,
  //       });
  //     }
  //   };

  //   fetchCurrentPassword();
  // }, [email]);
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="bg-gradient-to-br from-yellow-700 to-orange-400 text-white rounded-lg p-6 shadow-lg lg:w-1/4">
            <div className="text-center mb-8">
            <div className="relative inline-block">
                {/* Display the profile image */}
                <img
                  src={base64Image || "https://via.placeholder.com/100"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto object-cover"
                />
                {isAuthenticated && (
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
                )}
              </div>

              {/* Show username or login message */}
              {isAuthenticated ? (
               <div>
               <h2 className="text-xl font-semibold mt-2">{userData.username}</h2>
               <p className="text-sm">{userData.email}</p>
             </div>
               
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mt-2">Please Login</h2>
                  <p className="text-sm">To View Your Account Details</p>
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
            <div
  onClick={() => handleTabClick("wishlist")}
  className={`w-full text-left py-2 px-4 mt-4 rounded-lg flex items-center gap-4 ${
    activeTab === "wishlist"
      ? "bg-white text-blue-600 shadow-md" // Active state styling
      : "text-gray-200 hover:bg-white hover:text-blue-600 transition" // Inactive state styling
  }`}
>
  <FaHeart className="mr-2" />
  <span>Wishlist</span>
</div>

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
                <div className="flex items-center mb-8 ml-60">
               <FaUser className="text-yellow-500 text-3xl animate-pulse" />
      <h2 className="text-2xl font-semibold text-gray-800 animate-text ml-4">
   Personal Information
      </h2>
    </div>
<form className="space-y-8 max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xl">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="relative">
      <i className="fa fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full p-4 pl-14 border rounded-lg text-lg   border-gray-300 placeholder-gray-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <div className="relative">
      <i className="fa fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full p-4 pl-14 border rounded-lg text-lg border-gray-300 placeholder-gray-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
      />
    </div>
  </div>
  <div className="relative">
    <i className="fa fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full p-4 pl-14 border rounded-lg text-lg  border-gray-300 placeholder-gray-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
    />
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="relative">
      <i className="fa fa-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
      <input
        type="tel"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-4 pl-14 border rounded-lg text-lg  border-gray-300 placeholder-gray-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <div className="relative">
      <i className="fa fa-venus-mars absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full p-4 pl-14 border rounded-lg text-lg  border-gray-300 placeholder-gray-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
  </div>
  <div className="relative">
    <i className="fa fa-calendar absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
    <input
      type="date"
      value={dob}
      onChange={(e) => setDob(e.target.value)}
      className="w-full p-4 pl-14 border rounded-lg text-lg  border-gray-300 placeholder-gray-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400"
    />
  </div>
  <button
    type="submit"
    onClick={handleSave}
    className="w-full bg-gradient-to-r from-yellow-700 to-orange-500 text-white py-3 rounded-lg text-lg transition flex items-center justify-center"
  >
    <i className="fa fa-save mr-2"></i> Save Changes
  </button>
</form>


              </div>
            )}
            {activeTab === "address" && (
              <div>
               <div className="flex items-center mb-8 ml-60">
               <FaMapMarked className="text-yellow-500 text-3xl animate-pulse" />
      <h2 className="text-2xl font-semibold text-gray-800 animate-text ml-4">
      Manage Address
      </h2>
    </div>
<form className="space-y-6 max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
<div className="relative">
          <i className="fa fa-home absolute left-4 top-4 text-gray-500"></i>
          <textarea
            placeholder="Address Line 1"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="w-full p-4 pl-12 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition duration-300"
          />
        </div>
        
        <div className="relative">
          <i className="fa fa-home absolute left-4 top-4 text-gray-500"></i>
          <textarea
            placeholder="Address Line 2"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            className="w-full p-4 pl-12 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition duration-300"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <i className="fa fa-city absolute left-4 top-4 text-gray-500"></i>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-4 pl-12 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition duration-300"
            />
          </div>
          
          <div className="relative">
            <i className="fa fa-flag absolute left-4 top-4 text-gray-500"></i>
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-4 pl-12 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition duration-300"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <i className="fa fa-map-pin absolute left-4 top-4 text-gray-500"></i>
            <input
              type="text"
              placeholder="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full p-4 pl-12 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition duration-300"
            />
          </div>
          <div className="relative">
  <i className="fa fa-globe-americas absolute left-4 top-4 text-gray-500"></i>
  <select
    value={country}
    onChange={(e) => setCountry(e.target.value)}
    className="w-full p-4 pl-12 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition duration-300"
  >
    <option value="" disabled>Select a Country</option>
    <option value="United States">United States</option>
    <option value="Canada">Canada</option>
    <option value="United Kingdom">United Kingdom</option>
    <option value="Australia">Australia</option>
    <option value="India">India</option>
    <option value="Germany">Germany</option>
    <option value="France">France</option>
    <option value="Mexico">Mexico</option>
    <option value="Brazil">Brazil</option>
    <option value="Japan">Japan</option>
    {/* Add more countries as needed */}
  </select>
</div>

        </div>
        
        <button
          type="submit"
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-yellow-700 to-orange-500 text-white py-3 rounded-lg text-lg transition flex items-center justify-center"
        >
          <i className="fa fa-save mr-2"></i> Save Address
        </button>
</form>

              </div>
            )}
            {activeTab === "password" && (
              <div>
                <div className="flex items-center mb-8 ml-60">
      <FaLock className="text-yellow-500 text-3xl animate-pulse" />
      <h2 className="text-2xl font-semibold text-gray-800 animate-text ml-4">
        Password Settings
      </h2>
    </div>
                <form className="space-y-6 max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg" onSubmit={handleChangePassword}>
 
  <div className="relative">
    <label className="text-sm font-medium text-gray-600 mb-2 block">Current Password</label>
    <input
            type={isCurrentPasswordVisible ? 'text' : 'password'}
            placeholder="Enter Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
          />
          <i
            className={`fa ${isCurrentPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} absolute right-4 top-12 cursor-pointer text-gray-400`}
            onClick={() => togglePasswordVisibility('current')}
          ></i>
  </div>

  <div className="relative">
    <label className="text-sm font-medium text-gray-600 mb-2 block">New Password</label>
    <input
      type={isNewPasswordVisible ? 'text' : 'password'}
      placeholder="Enter New Password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
    />
    <i
      className={`fa ${isNewPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} absolute right-4 top-12 cursor-pointer text-gray-400`}
      onClick={() => togglePasswordVisibility('new')}
    ></i>
  </div>

  <div className="relative">
    <label className="text-sm font-medium text-gray-600 mb-2 block">Confirm Password</label>
    <input
      type={isConfirmPasswordVisible ? 'text' : 'password'}
      placeholder="Confirm New Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
    />
    <i
      className={`fa ${isConfirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} absolute right-4 top-12 cursor-pointer text-gray-400`}
      onClick={() => togglePasswordVisibility('confirm')}
    ></i>
  </div>

  <button
    type="submit"
    className="w-full bg-gradient-to-r from-yellow-700 to-orange-500 text-white py-3 rounded-lg text-lg transition hover:opacity-90"
    disabled={loading}
  >
    {loading ? 'Updating...' : 'Change Password'}
  </button>
</form>
              </div>
            )}
        {activeTab === "payment" && (
  <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto">
    <div className="flex items-center mb-6">
      <FaCreditCard className="text-yellow-500 text-3xl mr-4 hover:text-yellow-600 transition-colors" />
      <h2 className="text-2xl font-semibold text-gray-800">Payment Methods</h2>
    </div>
    <form className="space-y-6" onSubmit={handleSave}>
      <div className="relative">
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
        />
        <div className="absolute top-3 left-3 text-gray-500">
          <FaCreditCard />
        </div>
      </div>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Expiration Date (MM/YY)"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
        />
        <div className="absolute top-3 left-3 text-gray-500">
          <FaCalendarAlt />
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="CVC"
          value={cvc}
          onChange={(e) => setCvc(e.target.value)}
          className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
        />
        <div className="absolute top-3 left-3 text-gray-500">
          <FaLock />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-yellow-700 to-orange-500  text-white py-3 rounded-lg hover:bg-teal-600 transition duration-300"
      >
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
