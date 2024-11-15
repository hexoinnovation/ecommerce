import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { HomeIcon, PhoneIcon } from "@heroicons/react/outline";
import { FaThList, FaTimes, FaChevronRight, FaChevronLeft } from "react-icons/fa";

export const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Manage sidebar visibility
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate("/");
    };

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showSubcategories, setShowSubcategories] = useState(false);
  
    // Show subcategories on category click
    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
        setShowSubcategories(true); // Show subcategories view on category click
    };

    // Handle subcategory click
    const handleSubcategoryClick = (subcategory) => {
        setShowSubcategories(false); // Hide subcategories view after selection
    };

    // Handle back button to return to categories list
    const handleBackClick = () => {
        setShowSubcategories(false); // Hide subcategories view
        setSelectedCategory("All"); // Reset the category to 'All'
    };

    // Toggle Sidebar for mobile view
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={` w-72 h-full lg:pr-8 mb-8 lg:mb-0 transition-all`}>
            {/* Mobile toggle button */}
            <button 
                onClick={toggleSidebar} 
                className="lg:hidden p-4 text-gray-600 dark:text-white focus:outline-none"
            >
                {sidebarOpen ? <FaTimes className="h-6 w-6" /> : <FaThList className="h-6 w-6" />}
            </button>

            {/* Sidebar */}
            <div className={`${sidebarOpen ? "block" : "hidden"} lg:block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 transition-all`}>
                {/* Home Button */}
                <button
                    onClick={handleHomeClick}
                    className="w-full mt-14 sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2"
                >
                    <HomeIcon className="h-5 w-5 text-black dark:text-white" /> {/* Home Icon */}
                    <span>Home</span>
                </button>

                {/* Categories Section */}
                <button
                    className="w-full mt-14 sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2"
                >
                    <FaThList className="h-5 w-5 text-black dark:text-white" /> {/* Category Icon */}
                    <span>Categories</span>
                </button>

                {/* Categories List */}
                {!showSubcategories && (
                    <div className="space-y-4">
                        {/* Categories Buttons */}
                        <button
                            onClick={() => handleCategoryClick("Electronics")}
                            className={`flex items-center w-44 justify-between text-left px-4 py-3 rounded-md text-lg font-medium transition-all duration-300 ease-in-out ${
                                selectedCategory === "Electronics"
                                    ? "bg-primary text-white shadow-lg"
                                    : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-700 hover:bg-primary hover:text-white"
                            }`}
                        >
                            <span>Electronics</span>
                            <FaChevronRight className="text-gray-600 dark:text-white" />
                        </button>
                        <button
                            onClick={() => handleCategoryClick("Fashion")}
                            className={`flex items-center justify-between w-44 text-left px-4 py-3 rounded-md text-lg font-medium transition-all duration-300 ease-in-out ${
                                selectedCategory === "Fashion"
                                    ? "bg-primary text-white shadow-lg"
                                    : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-700 hover:bg-primary hover:text-white"
                            }`}
                        >
                            <span>Fashion</span>
                            <FaChevronRight className="text-gray-600 dark:text-white" />
                        </button>
                        <button
                            onClick={() => handleCategoryClick("Home")}
                            className={`flex items-center justify-between w-44 text-left px-4 py-3 rounded-md text-lg font-medium transition-all duration-300 ease-in-out ${
                                selectedCategory === "Home"
                                    ? "bg-primary text-white shadow-lg"
                                    : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-700 hover:bg-primary hover:text-white"
                            }`}
                        >
                            <span>Home</span>
                            <FaChevronRight className="text-gray-600 dark:text-white" />
                        </button>
                        <button
                            onClick={() => handleCategoryClick("Appliances")}
                            className={`flex items-center justify-between w-44 text-left px-4 py-3 rounded-md text-lg font-medium transition-all duration-300 ease-in-out ${
                                selectedCategory === "Appliances"
                                    ? "bg-primary text-white shadow-lg"
                                    : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-700 hover:bg-primary hover:text-white"
                            }`}
                        >
                            <span>Appliances</span>
                            <FaChevronRight className="text-gray-600 dark:text-white" />
                        </button>
                        <button
                            onClick={() => handleCategoryClick("Books")}
                            className={`flex items-center justify-between w-44 text-left px-4 py-3 rounded-md text-lg font-medium transition-all duration-300 ease-in-out ${
                                selectedCategory === "Books"
                                    ? "bg-primary text-white shadow-lg"
                                    : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-700 hover:bg-primary hover:text-white"
                            }`}
                        >
                            <span>Books</span>
                            <FaChevronRight className="text-gray-600 dark:text-white" />
                        </button>
                        <button
                            onClick={() => handleCategoryClick("Toys")}
                            className={`flex items-center justify-between w-44 text-left px-4 py-3 rounded-md text-lg font-medium transition-all duration-300 ease-in-out ${
                                selectedCategory === "Toys"
                                    ? "bg-primary text-white shadow-lg"
                                    : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-700 hover:bg-primary hover:text-white"
                            }`}
                        >
                            <span>Toys</span>
                            <FaChevronRight className="text-gray-600 dark:text-white" />
                        </button>
                        <button
                            onClick={() => handleCategoryClick("Sports")}
                            className={`flex items-center justify-between w-44 text-left px-4 py-3 rounded-md text-lg font-medium transition-all duration-300 ease-in-out ${
                                selectedCategory === "Sports"
                                    ? "bg-primary text-white shadow-lg"
                                    : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-700 hover:bg-primary hover:text-white"
                            }`}
                        >
                            <span>Sports</span>
                            <FaChevronRight className="text-gray-600 dark:text-white" />
                        </button>
                    </div>
                )}

                {/* Subcategories view (when a category is selected) */}
                {showSubcategories && selectedCategory && (
                    <div className="space-y-4">
                        <button
                            onClick={handleBackClick}
                            className="flex items-center w-44 text-gray-700 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all duration-200"
                        >
                            <FaChevronLeft className="mr-2" />
                            Back to Categories
                        </button>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
                            {selectedCategory} Subcategories
                        </h3>
                        <ul>
                            {/* Manually specify subcategories */}
                            {selectedCategory === "Electronics" && (
                                <>
                                    <Link to='/phone'>
                                        <li
                                            onClick={() => handleSubcategoryClick("Phones")}
                                            className=" w-44 cursor-pointer flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all duration-200 transform hover:scale-105 hover:bg-primary/20 px-4 py-2 rounded-md"
                                        >
                                            <FaChevronRight className="text-sm text-gray-500 dark:text-gray-300" />
                                            Phones
                                        </li>
                                    </Link>
                                    <Link to='/laptop'>
                                        <li
                                            onClick={() => handleSubcategoryClick("Laptops")}
                                            className=" w-44 cursor-pointer flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all duration-200 transform hover:scale-105 hover:bg-primary/20 px-4 py-2 rounded-md"
                                        >
                                            <FaChevronRight className="text-sm text-gray-500 dark:text-gray-300" />
                                            Laptops
                                        </li>
                                    </Link>
                                    <Link to='/camera'>
                                        <li
                                            onClick={() => handleSubcategoryClick("Cameras")}
                                            className="w-44 cursor-pointer flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all duration-200 transform hover:scale-105 hover:bg-primary/20 px-4 py-2 rounded-md"
                                        >
                                            <FaChevronRight className="text-sm text-gray-500 dark:text-gray-300" />
                                            Cameras
                                        </li>
                                    </Link>
                                </>
                            )}

                            {selectedCategory === "Fashion" && (
                                <>
                                    <li
                                        onClick={() => handleSubcategoryClick("Men")}
                                        className=" w-44 cursor-pointer flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all duration-200 transform hover:scale-105 hover:bg-primary/20 px-4 py-2 rounded-md"
                                    >
                                        <FaChevronRight className="text-sm text-gray-500 dark:text-gray-300" />
                                        Men
                                    </li>
                                    <li
                                        onClick={() => handleSubcategoryClick("Women")}
                                        className="w-44 cursor-pointer flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all duration-200 transform hover:scale-105 hover:bg-primary/20 px-4 py-2 rounded-md"
                                    >
                                        <FaChevronRight className="text-sm text-gray-500 dark:text-gray-300" />
                                        Women
                                    </li>
                                    <li
                                        onClick={() => handleSubcategoryClick("Kids")}
                                        className="w-44 cursor-pointer flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all duration-200 transform hover:scale-105 hover:bg-primary/20 px-4 py-2 rounded-md"
                                    >
                                        <FaChevronRight className="text-sm text-gray-500 dark:text-gray-300" />
                                        Kids
                                    </li>
                                </>
                            )}

                            {/* Add more categories as needed */}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
