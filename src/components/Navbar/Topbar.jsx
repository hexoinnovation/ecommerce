import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa"; // Importing social media icons
import "./Topbar.css"; // Make sure to create the CSS for TopBar

const Topbar = () => {
  return (
    <div className="top-bar">
      <div className="top-bar-container">
        <span className="top-bar-left">
          <a
            href="/"
            className="text-xl font-bold text-green-500 hover:text-green-700 hover:underline transition-all duration-500 ease-in-out transform hover:scale-110 animate-pulse"
          >
            Free Shipping on Orders Over $50
          </a>
        </span>

        <div className="top-bar-right">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon "
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
