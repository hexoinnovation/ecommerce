import React, { useState, useEffect } from "react";
import Image1 from "../../assets/hero/women.png";
import Image2 from "../../assets/hero/shopping.png";
import Image3 from "../../assets/hero/sale.png";
import Slider from "react-slick";
import { db } from "../firebase";  // Correct path from Hero.jsx
import { doc, setDoc, getDoc } from "firebase/firestore"; // Add doc and setDoc

import { collection, addDoc, query, where, getDocs } from "firebase/firestore";  // Import Firestore methods
import { FaEnvelope, FaLock ,FaUserCircle} from "react-icons/fa";
const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Upto 50% off on all Men's Wear",
    description:
      "lorem His Life will forever be Changed dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    img: Image2,
    title: "30% off on all Women's Wear",
    description:
      "Who's there lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    img: Image3,
    title: "70% off on all Products Sale",
    description:
      "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const Hero = ({ handleOrderPopup }) => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State to store success message
  useEffect(() => {
    // Show login popup after 2 seconds
    const timer = setTimeout(() => {
      setShowLoginPopup(true);
    }, 2000);
  
    // Log successMessage if it's updated
    if (successMessage) {
      console.log(successMessage);
    }
  
    // Cleanup timer
    return () => clearTimeout(timer);
  }, [successMessage]); // Include successMessage as a dependency to trigger on updates
  
  
// Function to check if email exists in Firestore
const checkIfEmailExists = async (email) => {
  const userDocRef = doc(db, "users", email);  // Using email as the document ID
  const userDocSnap = await getDoc(userDocRef);  // Fetch document with that email

  return userDocSnap.exists();  // If the document exists, return true
};

const handleLoginSubmit = async (e) => {
  e.preventDefault(); // Prevent page refresh on form submit
  
  // Validation: Check if both email and password are entered
  if (!email || !password) {
    setError("Both email and password are required.");
    return; // Exit if either email or password is empty
  }

  try {
    // Check if email already exists in Firestore by using the email as document ID
    const emailExists = await checkIfEmailExists(email);

    if (emailExists) {
      setError("This email is already registered.");
      setIsLoggedIn(true); // Log the user in without adding to Firestore
      setError(""); // Clear error message
    } else {
      // If email does not exist, create a new user document with the email as the document ID
      const userDocRef = doc(db, "users", email);  // Using email as document ID
      await setDoc(userDocRef, {
        email: email,
        password: password,  // Store password (ensure secure storage in real applications)
      });
      console.log("Email and password successfully stored in Firestore!");
setSuccessMessage("Login successful! Welcome to your account.");
      setEmail(""); 
      setPassword(""); 
      setIsLoggedIn(true); // Set logged in state
      setError(""); // Reset error message if successful
    }
  } catch (error) {
    console.error("Error adding email and password to Firestore: ", error);
    setError("Failed to login. Please try again."); // Set error message
      setSuccessMessage(""); // Clear success message on error
  }
};

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200">
      {/* background pattern */}
      <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-[8]"></div>

      {/* hero section */}
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* text content section */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                  >
                    {data.title}
                  </h1>
                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    className="text-sm"
                  >
                    {data.description}
                  </p>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                  >
                    {/* Order Now button is visible only after login */}
                    {isLoggedIn ? (
                      <button
                        onClick={handleOrderPopup}
                        className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                      >
                        Order Now
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full opacity-50"
                      >
                        Order Now
                      </button>
                    )}
                  </div>
                </div>

                {/* image section */}
                <div className="order-1 sm:order-2">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10"
                  >
                    <img
                      src={data.img}
                      alt=""
                      className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-105 lg:scale-120 object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="relative min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      {showLoginPopup && !isLoggedIn && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-white p-10 rounded-xl shadow-xl w-80 space-y-6">
            {/* Heading with Icon */}
            <div className="flex items-center justify-center space-x-2 text-gray-800 dark:text-white">
              <FaUserCircle className="text-3xl text-blue-500" />
              <h2
                className="text-2xl font-semibold"
                style={{ fontFamily: "Playfair Display, serif" ,marginRight:"25px"}}
              >
                Login
              </h2>
            </div>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
                  placeholder="Enter your email"
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
                  placeholder="Enter your password"
                />
              </div>
              {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-md text-lg font-medium hover:from-indigo-600 hover:to-blue-500 focus:ring-2 focus:ring-blue-400 transition duration-200"
              >
                Login
              </button>
              {/* Conditionally render success message */}
    {successMessage && (
      <div style={{ color: 'green', marginTop: '10px' }}>
        {successMessage}
      </div>
    )}

   
    
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Hero;
