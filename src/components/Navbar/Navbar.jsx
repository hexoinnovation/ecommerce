// src/components/Navbar.js
import React, { useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';

const Navbar = () => {
  // State for dropdown visibility and theme toggle
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div>
      {/* Upper Navbar (Logo + Search + Login/Cart) */}
      <nav className="bg-primary/40 text-black shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="https://www.logo.wine/a/logo/Flipkart/Flipkart-Logo.wine.svg"
              alt="Flipkart Logo"
              className="h-8"
            />
            <span className="text-2xl font-bold">Hexo</span>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-2 flex-grow max-w-lg">
            <input
              type="text"
              className="w-full py-2 px-4 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Search for products, brands, and more"
            />
            <button className="bg-primary/40 text-white px-4 py-2 rounded-r-md hover:bg-yellow-600">
              Search
            </button>
          </div>

          {/* Right-side Links */}
          <div className="flex items-center space-x-6">
            {/* Login Button with Dropdown */}
            <div className="relative">
              <button
                className="text-black font-semibold flex items-center space-x-2"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>Login</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md py-2">
                  {/* Dropdown items */}
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5z"
                      ></path>
                    </svg>
                    Login
                  </button>
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5z"
                      ></path>
                    </svg>
                    My Account
                  </button>
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5z"
                      ></path>
                    </svg>
                    My Orders
                  </button>
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5z"
                      ></path>
                    </svg>
                    My Wishlist
                  </button>
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5z"
                      ></path>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button onClick={toggleTheme} className="text-black">
              {isDarkMode ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Lower Navbar (Category Links, Deals, etc.) */}
      <div className="bg-white text-black shadow-sm">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-2 px-4">
          {/* Category Links */}
          <div className="flex space-x-6">
            <button className="hover:bg-primary/40 px-4 py-2 rounded-md">Electronics</button>
            <button className="hover:bg-primary/40 px-4 py-2 rounded-md">Fashion</button>
            <button className="hover:bg-primary/40 px-4 py-2 rounded-md">Home</button>
            <button className="hover:bg-primary/40 px-4 py-2 rounded-md">Appliances</button>
            <button className="hover:bg-primary/40 px-4 py-2 rounded-md">Books</button>
            <button className="hover:bg-primary/40 px-4 py-2 rounded-md">Toys</button>
            <button className="hover:bg-primary/40 px-4 py-2 rounded-md">Sports</button>
          </div>

          {/* Deals & Offers */}
          <div className="flex space-x-6">
            <button className="hover:bg-primary/40 px-4 py-2 rounded-md">Top Offers</button>
            <button className="hover:bg-primary/40 px-4 py-2 rounded-md">Flash Sale</button>
            <button className="hover:bg-primary/40 px-4 py-2 rounded-md">Bestsellers</button>
          </div>

          {/* Other Utility Links */}
          <div className="flex space-x-6">
            <button className="hover:bg-primary/40 px-4 py-2 rounded-md">Gift Cards</button>
            <button className="hover:bg-primary/40 px-4 py-2 rounded-md">Customer Care</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
