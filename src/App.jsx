
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router, Routes, and Route
import Navbar from "./components/Navbar/Navbar";
//import EmailForm from './components/Navbar/EmailForm'; // Adjust based on your folder structure

import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";

import AOS from "aos";
import "aos/dist/aos.css";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const handleSendOtp = async () => {
    // Code to send OTP
    setOtpSent(true); // Update the otpSent state after OTP is sent
  };

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <Router> {/* Wrap your components with Router */}
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
    
        <Navbar handleOrderPopup={handleOrderPopup} />
        <Hero handleOrderPopup={handleOrderPopup} />
        <Products/>
        <TopProducts handleOrderPopup={handleOrderPopup} />
       
        <Banner />
        <Subscribe />
        <Testimonials />
        <Footer />
        <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
       
       
      
      </div>
    </Router>
  );
};

export default App;
