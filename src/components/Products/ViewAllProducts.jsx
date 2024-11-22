import React, { useState } from "react";
import { Sidebar } from "../Sidebar";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useProducts } from "../../context/ProductsContext";

export const ViewAllProducts = () => {
  const products = useProducts();
  console.log("view:", products);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // Set how many products to show per page
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setCurrentPage(1); // Reset to the first page when filtering
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to ProductDetails page with the product ID
  };

  // Filter products by selected subcategory
  const filteredProducts = selectedSubcategory
    ? products.filter(
        (product) =>
          (product.subcategory || "").trim().toLowerCase() ===
          selectedSubcategory.trim().toLowerCase()
      )
    : products;

  console.log("filteredProducts:", filteredProducts);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar onSubcategorySelect={handleSubcategorySelect} />

      {/* Main Product Listing */}
      <div className="flex-1 p-4 lg:p-8 bg-gray-100 dark:bg-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        {selectedSubcategory && (
          <h4 className="text-lg font-medium mb-6">
            Filtered by: <span className="text-primary">{selectedSubcategory}</span>
          </h4>
        )}

        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="relative mb-4">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-56 object-cover rounded-md cursor-pointer"
                    onClick={() => handleProductClick(product.id)} // Trigger navigation to ProductDetails page
                  />
                  {/* <FaHeart
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors text-xl cursor-pointer"
                  /> */}
                </div>

                {/* Product Details */}
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {product.description}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Color:</span> {product.color}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={index < product.rating ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ₹{product.price}
                  </p>
                </div>

                {/* Action Buttons */}
                {/* <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-primary text-white py-2 rounded-lg shadow-md hover:bg-primary-dark transition">
                    <FaShoppingCart className="inline-block mr-2" />
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition">
                    Buy Now
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 text-center mt-12">
            No products available for the selected category.
          </p>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
