
import React, { useState } from 'react';
import { MoonIcon, SunIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/solid'; // Importing icons from Heroicons

const Navbar = () => {
  // State for dropdown visibility, theme toggle, sidebar visibility
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null); // For mobile dropdown toggle
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput }),
      });
      if (response.ok) {
        setEmail(emailInput);
        setOtpSent(true);
        alert('OTP sent to your email!');
      } else {
        alert('Error sending OTP');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle Sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Categories and their respective names
  const categories = [
    { name: 'Electronics', subcategories: ['Phones', 'Laptops', 'Cameras'] },
    { name: 'Fashion', subcategories: ['Men', 'Women', 'Kids'] },
    { name: 'Home', subcategories: ['Furniture', 'Decor', 'Appliances'] },
    { name: 'Appliances', subcategories: ['Kitchen', 'Laundry', 'Cleaning'] },
    { name: 'Books', subcategories: ['Fiction', 'Non-Fiction', 'E-books'] },
    { name: 'Toys', subcategories: ['Action Figures', 'Dolls', 'Puzzles'] },
    { name: 'Sports', subcategories: ['Football', 'Basketball', 'Fitness'] },
  ];

  return (
    <div>
      {/* Upper Navbar */}
      <nav className="bg-primary/40 text-black shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2">
          {/* Left Side (Toggle Menu and Logo) */}
          <div className="flex items-center space-x-4">
            {/* Mobile toggle button */}
            <button
              className="lg:hidden text-black dark:text-white"
              onClick={toggleSidebar}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">Hexo</span>
            </div>
          </div>

          {/* Desktop View - Search Bar and Icons */}
          <div className="hidden lg:flex items-center space-x-4 w-full justify-center">
            {/* Search Bar (centered) */}
            <div className="flex items-center space-x-2 flex-grow max-w-3xl">
              <input
                type="text"
                className="w-full py-2 px-4 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white"
                placeholder="Search for products, brands, and more"
              />
              <button className="bg-primary/40 text-white px-4 py-2 rounded-r-md hover:bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-400">
                Search
              </button>
            </div>
          </div>

          {/* Right Side (Login, Cart, Theme Toggle, Admin Icon) */}
          <div className="flex items-center space-x-4">
            {/* Login Button with Dropdown */}
            <div className="relative">
              <button
                className="text-black dark:text-white font-semibold flex items-center space-x-2"
                onClick={toggleLoginDropdown}
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
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100">Login</button>
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100">My Account</button>
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100">My Orders</button>
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100">My Wishlist</button>
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
      {/* Login Modal */}
      {loginModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Login</h2>
                    <button onClick={closeLoginModal} className="text-black">
                      ✕
                    </button>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 p-4 flex flex-col items-center mb-20">
                      <form onSubmit={handleEmailSubmit}>
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full py-2 px-4 mb-28 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <button className="bg-primary/40 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
                          Request OTP
                        </button>
                      </form>
                    </div>

                    {/* Image Section */}
                    <div className="w-1/2 p-4 flex justify-center items-center">
                      <img
                        src={Image} // Replace with an actual eCommerce image URL
                        alt="eCommerce"
                        className="rounded-md shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Cart Icon */}
            <button className="text-black dark:text-white">
              <ShoppingCartIcon className="w-6 h-6" />
            </button>

            {/* Admin Icon (now replaced with a User Icon) */}
            <button className="text-black dark:text-white">
              <UserIcon className="w-6 h-6" />
            </button>

            {/* Theme Toggle Button */}
            <button onClick={toggleTheme} className="text-black dark:text-white">
              {isDarkMode ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu (Mobile View - Toggle Menu) */}
      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}
      >
        <div className="w-64 bg-white dark:bg-gray-800 p-4 h-full">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-black dark:text-white">Hexo</span>
            <button onClick={toggleSidebar} className="text-black dark:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4 flex items-center space-x-2">
            <input
              type="text"
              className="w-full py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white"
              placeholder="Search for products, brands, and more"
            />
          </div>

          {/* Login Dropdown */}
          <div className="relative mb-4">
            <button
              className="text-black font-semibold flex items-center space-x-2 w-full"
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
                <button className="flex items-center px-4 py-2 hover:bg-gray-100">Login</button>
                <button className="flex items-center px-4 py-2 hover:bg-gray-100">My Account</button>
                <button className="flex items-center px-4 py-2 hover:bg-gray-100">My Orders</button>
                <button className="flex items-center px-4 py-2 hover:bg-gray-100">My Wishlist</button>
                <button className="flex items-center px-4 py-2 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>

          {/* Categories List */}
          <div>
            <h3 className="font-semibold text-lg">Categories</h3>
            <ul className="space-y-2 mt-4">
              {categories.map((category) => (
                <li key={category.name} className="text-black hover:bg-gray-100 px-4 py-2 rounded-md">
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Lower Navbar (Desktop View - Category Links, etc.) */}
      <div className="bg-white text-black shadow-sm lg:block hidden">
        <div className="max-w-screen-xl mx-auto py-2 px-4">
          {/* Category Links with Images */}
          <div className="flex justify-center space-x-6 overflow-x-auto no-scrollbar py-2">
            {categories.map((category) => (
              <button
                key={category.name}
                className="flex flex-col items-center space-y-2 hover:bg-primary/40 px-4 py-2 rounded-md"
              >
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

