import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaHome,
  FaSearch,
  FaThLarge,
  FaTimes,
  FaShoppingCart,FaShoppingBag,FaRegFrownOpen,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase"; // Ensure you've set up Firebase correctly

export const Sidebar = ({ onSubcategorySelect }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isCategoryVisible, setIsCategoryVisible] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [products, setProducts] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false); // State for popup visibility
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

  const brands = ["Kurtis", "Footwear", "Mens wear", "Phone", "Adidas"];

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

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList); // Store fetched products in state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
    applyFilters(range, selectedBrands);
  };

  const handleBrandChange = (brand) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updatedBrands);
    applyFilters(priceRange, updatedBrands);
  };

  const applyFilters = (range, brands) => {
    const filtered = products.filter((product) => {
      const inPriceRange = product.price >= range[0] && product.price <= range[1];
      const inSelectedBrands = brands.length
        ? brands.includes(product.category)
        : true;
      return inPriceRange && inSelectedBrands;
    });
    setFilteredProducts(filtered); // Store filtered products in state
  };

  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedBrands([]);
    applyFilters([0, 5000], []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters(priceRange, selectedBrands);
  }, [products]); // Reapply filters when products change

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to product details page
  };

  const toggleFilterPopup = () => {
    setIsFilterPopupOpen(!isFilterPopupOpen);
  };

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        className="lg:hidden fixed top-10 left-4 z-50 text-2xl dark:text-white text-white"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div
  className={`fixed top-0 left-0 z-40 h-full w-full max-w-sm transform transition-transform duration-300 sm:w-72 ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } lg:translate-x-0 dark:bg-gray-900 bg-white dark:text-white text-black lg:static p-6 flex flex-col shadow-lg`}
>
  {/* Home Icon */}
  <div className="mb-6">
    <button
      onClick={goToHomePage}
      className="dark:bg-gray-900 bg-white dark:text-white text-black flex items-center space-x-2 hover:bg-primary/40 dark:hover:bg-gray-800 p-3 rounded-lg transition-all duration-200 ease-in-out"
    >
      <FaHome className="text-xl" />
      <span>Home</span>
    </button>
  </div>

  {/* Search Bar */}
  <div className="mb-16 relative">
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearchChange}
      placeholder="Search categories..."
      className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
    />
    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300" />
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
  <div className="mt-6">
    <h2 className="text-xl font-semibold mb-3 flex items-center space-x-2">
      <FaFilter />
      <span>Filters</span>
    </h2>
    <button
      onClick={toggleFilterPopup}
      className="w-full mt-4 bg-primary text-white py-2 rounded-lg"
    >
      Open Filters
    </button>
  </div>
</div>


      {isFilterPopupOpen && (
  <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 md:p-8 w-full max-w-6xl mx-2 md:mx-4 rounded-lg shadow-xl overflow-auto max-h-[90vh] relative">
      <span
        className="absolute top-2 right-2 text-2xl md:text-3xl cursor-pointer text-gray-500 hover:text-gray-700"
        onClick={toggleFilterPopup}
      >
        &times;
      </span>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-center">
        Filter Products
      </h2>

      {/* Price Range Filter */}
      <div className="mb-4 md:mb-6">
        <label className="text-sm font-semibold">Price Range</label>
        <div className="flex justify-between text-sm md:text-base">
          <span>{`₹${priceRange[0]} - ₹${priceRange[1]}`}</span>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4 md:mb-6">
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange[0]}
            onChange={(e) =>
              handlePriceChange([Number(e.target.value), priceRange[1]])
            }
            className="w-full"
          />
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange[1]}
            onChange={(e) =>
              handlePriceChange([priceRange[0], Number(e.target.value)])
            }
            className="w-full"
          />
        </div>
        <p>₹{priceRange[0]} - ₹{priceRange[1]}</p>
      </div>

      {/* Brands Filter */}
      <div className="mb-4 md:mb-6">
        <label className="text-sm font-semibold">Brands</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                id={`brand-${brand}`}
                className="h-4 w-4 md:h-5 md:w-5"
              />
              <label htmlFor={`brand-${brand}`} className="text-sm">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 space-y-2 md:space-y-0">
        <button
          onClick={resetFilters}
          className="bg-gray-200 text-black py-2 px-4 rounded-md hover:bg-gray-300 w-full md:w-auto"
        >
          Reset
        </button>
      </div>

      {/* Filtered Products */}
      <div className="mt-4 md:mt-6">
        <h3 className="text-lg md:text-xl font-semibold text-center">
          Filtered Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 border rounded-lg shadow-lg hover:shadow-2xl transition transform hover:scale-105 cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="h-40 md:h-64 bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h4 className="font-semibold text-base md:text-lg mb-2">
                  {product.name}
                </h4>
                <h4 className="text-sm text-gray-500">{product.category}</h4>
                <p className="text-gray-600 text-sm mb-4">₹{product.price}</p>
                <div className="flex justify-between items-center space-x-2">
                  <button className="flex items-center justify-center bg-primary text-xs text-white px-3 py-2 rounded-md shadow-md hover:bg-primary-dark transition">
                    Add to Cart
                  </button>
                  <button className="flex items-center justify-center bg-green-600 text-xs text-white px-3 py-2 rounded-md shadow-md hover:bg-green-700 transition">
                    Buy Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col justify-center items-center text-center space-y-4 py-6">
              <div className="text-6xl text-gray-400 animate-bounce">
                <FaRegFrownOpen />
              </div>
              <p className="text-lg font-semibold text-gray-500">
                No products match the filter.
              </p>
              <p className="text-sm text-gray-400">
                Try adjusting your filters or search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
};
