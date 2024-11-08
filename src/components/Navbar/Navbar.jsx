import React, { useState } from 'react';
import { MoonIcon, SunIcon, ShoppingCartIcon, UserIcon, UserCircleIcon, ShoppingBagIcon, CogIcon, LogoutIcon } from '@heroicons/react/solid'; // Importing icons from Heroicons

const Navbar = () => {
  // State for dropdown visibility, theme toggle, sidebar visibility
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null); // For mobile dropdown toggle
  const [dropdownOpen, setDropdownOpen] = useState(false); // For login dropdown
  const [isDarkMode, setIsDarkMode] = useState(false); // For dark mode toggle
  const [sidebarOpen, setSidebarOpen] = useState(false); // For sidebar visibility

  const categories = [
    { name: 'Electronics', subcategories: ['Phones', 'Laptops', 'Cameras'] },
    { name: 'Fashion', subcategories: ['Men', 'Women', 'Kids'] },
    { name: 'Home', subcategories: ['Furniture', 'Decor', 'Appliances'] },
    { name: 'Appliances', subcategories: ['Kitchen', 'Laundry', 'Cleaning'] },
    { name: 'Books', subcategories: ['Fiction', 'Non-Fiction', 'E-books'] },
    { name: 'Toys', subcategories: ['Action Figures', 'Dolls', 'Puzzles'] },
    { name: 'Sports', subcategories: ['Football', 'Basketball', 'Fitness'] },
  ];

  // Toggle category dropdown visibility for mobile view
  const toggleCategoryDropdown = (index) => {
    if (openCategoryIndex === index) {
      setOpenCategoryIndex(null); // Close dropdown if it's already open
    } else {
      setOpenCategoryIndex(index); // Open the selected category dropdown
    }
  };

  // Toggle login dropdown
  const toggleLoginDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Toggle sidebar visibility for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle theme between dark and light mode
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
      {/* Upper Navbar */}
      <nav className="bg-primary/40 text-black dark:bg-gray-900 dark:text-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2">
          {/* Left Side (Toggle Menu and Logo) */}
          <div className="flex items-center space-x-4">
            {/* Mobile toggle button */}
            <button className="lg:hidden text-black dark:text-white" onClick={toggleSidebar}>
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-md py-2">
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <UserCircleIcon className="w-5 h-5 mr-2" />
                    Login
                  </button>
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
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
                  <button className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <LogoutIcon className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <button className="text-black dark:text-white">
              <ShoppingCartIcon className="w-6 h-6" />
            </button>

            {/* Admin Icon (replaced with User Icon for now) */}
            <button className="text-black dark:text-white">
              <UserIcon className="w-6 h-6" />
            </button>

            {/* Theme Toggle Button */}
            <button onClick={toggleTheme} className="text-black dark:text-white">
              {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu (Mobile View - Toggle Menu) */}
      <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
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
            <button className="bg-primary/40 text-white px-4 py-2 rounded-md hover:bg-yellow-600 dark:bg-yellow-500 dark:hover:bg-yellow-400">
              Search
            </button>
          </div>

          {/* Categories List */}
          <div>
            <h3 className="font-semibold text-lg text-black dark:text-white">Categories</h3>
            <ul className="space-y-2 mt-4">
              {categories.map((category, index) => (
                <li key={category.name}>
                  <button
                    onClick={() => toggleCategoryDropdown(index)}
                    className="w-full text-left flex items-center space-x-2 hover:bg-primary/40 px-4 py-2 rounded-md"
                  >
                    <span>{category.name}</span>
                    <svg
                      className={`w-4 h-4 transform transition-all duration-300 ${openCategoryIndex === index ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Subcategories Dropdown */}
                  {openCategoryIndex === index && (
                    <div className="bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-md mt-2 w-full">
                      <ul className="space-y-2 py-2">
                        {category.subcategories.map((subcat) => (
                          <li key={subcat} className="hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md">
                            {subcat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Lower Navbar (Desktop View - Category Links) */}
      <div className="bg-white text-black shadow-sm lg:block hidden mt-16 dark:bg-gray-800 dark:text-white">
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
