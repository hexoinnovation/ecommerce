import React, { useState } from "react";
import { ProductsData } from "./Products"; // Import the ProductsData from Products
import { FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import icons

const categories = [
  { name: 'Electronics', subcategories: ['Phones', 'Laptops', 'Cameras'] },
  { name: 'Fashion', subcategories: ['Men', 'Women', 'Kids'] },
  { name: 'Home', subcategories: ['Furniture', 'Decor', 'Appliances'] },
  { name: 'Appliances', subcategories: ['Kitchen', 'Laundry', 'Cleaning'] },
  { name: 'Books', subcategories: ['Fiction', 'Non-Fiction', 'E-books'] },
  { name: 'Toys', subcategories: ['Action Figures', 'Dolls', 'Puzzles'] },
  { name: 'Sports', subcategories: ['Football', 'Basketball', 'Fitness'] },
];

const ViewAllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openCategory, setOpenCategory] = useState(null); // To track which category's dropdown is open
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  // Filter products based on selected category or subcategory
  const filteredProducts = selectedCategory === "All"
    ? ProductsData
    : ProductsData.filter(
        (product) => product.category === selectedCategory || product.subcategory === activeSubcategory
      );

  // Handle category hover
  const handleCategoryHover = (category) => {
    setOpenCategory(category.name); // Open the dropdown on hover
    setSelectedCategory(category.name); // Set the category as selected on hover
  };

  // Handle category mouse leave
  const handleCategoryLeave = () => {
    setOpenCategory(null); // Close the dropdown when the mouse leaves
  };

  // Handle subcategory click
  const handleSubcategoryClick = (subcategory) => {
    setActiveSubcategory(subcategory);
  };

  return (
    <div className="container flex flex-col lg:flex-row mt-14 sm:mt-5 mb-12">
      {/* Sidebar (Hidden on mobile, visible on large screens) */}
      <div className="lg:w-1/4 w-full lg:pr-8 mb-8 lg:mb-0 lg:block hidden">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Categories</h2>
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative"
                onMouseEnter={() => handleCategoryHover(category)} // Show dropdown on hover
                onMouseLeave={handleCategoryLeave} // Hide dropdown when mouse leaves
              >
                {/* Category Button */}
                <button
                  className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-md text-lg font-medium transition-all duration-300 ease-in-out ${
                    selectedCategory === category.name
                      ? "bg-primary text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-700 hover:bg-primary hover:text-white"
                  }`}
                >
                  <span>{category.name}</span>
                  {/* Dropdown Icon */}
                  {openCategory === category.name ? (
                    <FaChevronUp className="text-gray-600 dark:text-white" />
                  ) : (
                    <FaChevronDown className="text-gray-600 dark:text-white" />
                  )}
                </button>

                {/* Subcategory Dropdown */}
                {openCategory === category.name && (
                  <div className="mt-2 space-y-2 transition-all duration-300 ease-in-out">
                    <ul className="bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-md">
                      {category.subcategories.map((subcat) => (
                        <li
                          key={subcat}
                          onClick={() => handleSubcategoryClick(subcat)}
                          className="hover:bg-primary/55 dark:hover:bg-primary/55 px-4 py-2 rounded-md cursor-pointer transition-all duration-200"
                        >
                          {subcat}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="lg:w-3/4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <img
              src={product.img}
              alt={product.title}
              className="w-full h-56 object-cover rounded-md cursor-pointer transition-transform transform hover:scale-105"
            />
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{product.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{product.color}</p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`text-yellow-400 ${index < product.rating ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-gray-600 dark:text-gray-400">({product.rating})</span>
              </div>

              {/* Price */}
              <div className="mt-3">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">₹{product.price || "99.99"}</p>
              </div>
              <div className="mt-4">
                <button className="w-full bg-primary text-white py-2 rounded-md shadow-md hover:bg-primary-dark transition-colors ease-in-out">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllProducts;
