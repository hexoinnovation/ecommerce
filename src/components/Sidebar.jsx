import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaThLarge, FaChevronRight, FaChevronLeft, FaBars, FaTimes } from "react-icons/fa";

export const Sidebar = ({ onSubcategorySelect }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isCategoryVisible, setIsCategoryVisible] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const categories = {
    Electronics: ["Phones", "Laptops", "Cameras"],
    Fashion: ["Mens", "Womens", "Kids"],
    Home: ["Furniture", "Home Décor", "Kitchen & Dining"],
    Appliances: ["Kitchen Appliances", "Home Appliances", "Cleaning Appliances"],
    Books: ["Fiction", "Non-fiction", "Reference"],
  };

  const toggleCategory = (category) => {
    setActiveCategory(category);
    setIsCategoryVisible(false);
  };

  const goBackToCategory = () => {
    setIsCategoryVisible(true);
    setActiveCategory(null);
  };

  const goToHomePage = () => {
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        className="lg:hidden fixed top-2 left-4 z-50 text-2xl dark:text-white text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-72 transform transition-transform duration-300 sm:mt-0 mt-10 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 dark:bg-gray-900 bg-white dark:text-white text-black lg:static p-6 flex flex-col`}
      >
        {/* Home Icon */}
        <div className="mb-6">
          <button
            onClick={goToHomePage}
            className="dark:bg-gray-900 bg-white dark:text-white text-black flex items-center space-x-2 hover:bg-primary/40 dark:hover:bg-gray-800 p-3 rounded-lg transition-all duration-200 ease-in-out"
          >
            <h1 className="text-2xl font-semibold tracking-wider flex items-center space-x-2">
              <FaHome className="text-2xl" />
              <span>Home</span>
            </h1>
          </button>
        </div>

        {/* Category Slide */}
        {isCategoryVisible && (
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold tracking-wider flex items-center space-x-2">
                <FaThLarge className="text-xl" />
                <span>Categories</span>
              </h1>
            </div>
            <ul className="space-y-4">
              {Object.keys(categories).map((category) => (
                <li key={category}>
                  <div
                    onClick={() => toggleCategory(category)}
                    className="flex justify-between items-center cursor-pointer hover:bg-primary/40 dark:hover:bg-gray-800 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out"
                  >
                    <strong className="text-lg">{category}</strong>
                    <span>
                      <FaChevronRight className="text-lg" />
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Subcategory Slide */}
        {!isCategoryVisible && activeCategory && (
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col mb-3">
              <button
                onClick={goBackToCategory}
                className="dark:bg-gray-900 bg-white dark:text-white text-black flex items-center space-x-2 hover:bg-primary/40 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out"
              >
                <FaChevronLeft className="text-lg" />
                <span>Back to Categories</span>
              </button>
              <h2 className="text-2xl mt-3 font-semibold tracking-wider">{activeCategory}</h2>
            </div>
            <ul className="space-y-2">
              {categories[activeCategory].map((subcategory) => (
                <li
                  key={subcategory}
                  onClick={() => onSubcategorySelect(subcategory)}
                  className="cursor-pointer hover:bg-primary/40 dark:hover:bg-gray-700 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out"
                >
                  {subcategory}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
