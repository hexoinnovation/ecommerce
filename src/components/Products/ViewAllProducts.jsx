import React, { useState } from "react";
import { ProductsData } from "./Products"; // Import the ProductsData from Products
import { FaStar } from "react-icons/fa";

const categories = ["All", "Clothing", "Accessories", "Footwear"];

const ViewAllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? ProductsData
      : ProductsData.filter((product) => product.category === selectedCategory);

  return (
    <div className="container flex flex-col lg:flex-row mt-14 sm:mt-5 mb-12">
      {/* Sidebar */}
      <div className="lg:w-1/4 w-full lg:pr-8 mb-8 lg:mb-0">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Categories</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-4 py-3 rounded-md text-lg font-medium transition-colors duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-700 hover:bg-primary hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="lg:w-3/4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
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

              {/* Available Sizes */}
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">Sizes: </p>
                <div className="flex gap-2 mt-2">
                  {product.sizes.map((size, index) => (
                    <span
                      key={index}
                      className="text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-700 py-1 px-2 rounded-full text-sm"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mt-3">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">₹{product.price || "99.99"}</p>
              </div>
              <div className="mt-4">
                <button className="w-full bg-primary text-white py-2 rounded-md shadow-md hover:bg-primary-dark transition-colors">
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
