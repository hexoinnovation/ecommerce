import React from 'react';
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';

export const ShopPage = () => {
  const products = useProducts(); // Access the products from context
  const navigate = useNavigate();

  // Handle image click to navigate to product detail page
  const handleImageClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleViewAllClick = () => {
    navigate('/view-all');
  };

  // Slice the first 10 products to display
  const displayedProducts = products.slice(0, 10);

  return (
    <div className="mt-14 mb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p className="text-sm text-primary">Top Selling Products for You</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-xs text-gray-400 dark:text-gray-300">
            Explore our latest collection of stylish products for every occasion.
          </p>
        </div>

        {/* Conditional Rendering if No Products */}
        {products.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-300">
            <p>No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.img || '/fallback-image.jpg'} // Add fallback image
                    alt={product.name} // Use product name for alt text
                    className="h-[220px] w-full object-cover cursor-pointer transition-transform transform group-hover:scale-110"
                    onClick={() => handleImageClick(product.id)}
                  />
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.color}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`text-yellow-400 ${
                          index < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-gray-600 dark:text-gray-400">({product.rating.toFixed(1)})</span>
                  </div>

                  {/* Price */}
                  <div className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Products Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleViewAllClick}
            className="bg-primary text-white py-2 px-6 rounded-md font-semibold transition-colors duration-300 hover:bg-primary-dark"
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
};
