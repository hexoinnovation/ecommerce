import React, { useState } from "react";
import {
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaHeart,
  FaHome,
  FaSearch,
  FaThLarge,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Sidebar = ({ onSubcategorySelect }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isCategoryVisible, setIsCategoryVisible] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const navigate = useNavigate();

  const categories = {
    Electronics: ["Phones", "Laptops", "Cameras"],
    Fashion: ["Mens", "Womens", "Kids"],
    Home: ["Furniture", "Home Décor", "Kitchen & Dining"],
    Appliances: [
      "Kitchen Appliances",
      "Home Appliances",
      "Cleaning Appliances",
    ],
    Books: ["Fiction", "Non-fiction", "Reference"],
  };

  const brands = ["Apple", "Samsung", "Sony", "Nike", "Adidas"];

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPriceRange([e.target.value[0], priceRange[1]]);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand]
    );
  };

  const applyFilters = () => {
    // Apply filter logic (e.g., fetching products based on filters)
    alert("Filters applied!");
  };

  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedRating(0);
    setSelectedBrands([]);
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
        } lg:translate-x-0 dark:bg-gray-900 bg-white dark:text-white text-black lg:static p-6 flex flex-col shadow-lg`}
      >
        {/* Home Icon */}
        <div className="mb-6">
          <button
            onClick={goToHomePage}
            className="dark:bg-gray-900 bg-white dark:text-white text-black flex items-center space-x-2 hover:bg-primary/40 dark:hover:bg-gray-800 p-3 rounded-lg transition-all duration-200 ease-in-out"
          >
          
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-16 relative ">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search categories..."
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
          />
          <FaSearch className="absolute right-1  top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300" />
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
              {Object.keys(categories)
                .filter((category) =>
                  category.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((category) => (
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
              <h2 className="text-2xl mt-3 font-semibold tracking-wider">
                {activeCategory}
              </h2>
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

        {/* Filter Controls */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3 flex items-center space-x-2">
            <FaFilter />
            <span>Filters</span>
          </h2>

          {/* Price Range Filter */}
          <div className="mb-4">
            <label className="text-sm font-semibold">Price Range</label>
            <div className="flex justify-between">
              <span className="text-sm">{`₹${priceRange[0]} - ₹${priceRange[1]}`}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange[0]}
              onChange={(e) =>
                handlePriceChange([e.target.value, priceRange[1]])
              }
              className="w-full mb-2 mt-2"
            />
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange[1]}
              onChange={(e) =>
                handlePriceChange([priceRange[0], e.target.value])
              }
              className="w-full"
            />
          </div>

          {/* Rating Filter */}
          <div className="mb-4">
            <label className="text-sm font-semibold">Ratings</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`${
                    selectedRating === rating
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-600 text-black dark:text-white"
                  } p-2 rounded-full text-sm transition-all duration-200 ease-in-out`}
                >
                  {rating} ★
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <label className="text-sm font-semibold">Brands</label>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    id={brand}
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor={brand}
                    className={`text-sm ${
                      selectedBrands.includes(brand)
                        ? "text-primary"
                        : "text-black"
                    }`}
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Apply and Reset Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={resetFilters}
              className="bg-gray-300 p-2 rounded-md hover:bg-gray-400 transition-all duration-200 ease-in-out"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="bg-primary p-2 rounded-md text-white hover:bg-primary/80 transition-all duration-200 ease-in-out"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Favorites Button */}
        <div className="mt-auto">
          <button
            onClick={() => alert("Favorites clicked")}
            className="dark:bg-gray-900 bg-white dark:text-white text-black flex items-center space-x-2 hover:bg-primary/40 dark:hover:bg-gray-800 p-3 rounded-lg transition-all duration-200 ease-in-out"
          >
            <FaHeart className="text-xl" />
            <span>Favorites</span>
          </button>
        </div>
      </div>
    </>
  );
};
