import React, { useState } from "react";
import { ProductsData } from "./Products"; // Import the ProductsData from Products
import { FaStar } from "react-icons/fa"; // Import icons
import ShopNavbar from "./ShopNavbar";
import { Routes } from "react-router-dom";
import Footer from "../Footer/Footer";

const ViewAllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredProducts =
  selectedCategory === "All"
    ? ProductsData
    : ProductsData.filter(
        (product) =>
          product.category === selectedCategory ||
          product.subcategory === activeSubcategory
      );

  return (
    <>
    <ShopNavbar/>
    {/* <Routes></Routes> */}
    <div className="container flex flex-col lg:flex-row mt-14 sm:mt-5 mb-12">
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
    <Footer/>
    </>
  );
};

export default ViewAllProducts;
