import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaShoppingBag } from 'react-icons/fa'; // Added new icons
import { ProductsData } from '../Products/Products'; // Make sure the import path is correct

const ProductDetail = () => {
  const { id } = useParams();  // Get the product ID from the URL
  const product = ProductsData.find((item) => item.id === parseInt(id));

  // Manage selected size state
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) {
    return <div>Product not found</div>;  // Handle the case where product is not found
  }

  // Handle size selection
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="mt-16 sm:mt-5 mb-12 container px-4 lg:px-16 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Image Section */}
        <div className="flex flex-col items-center lg:items-start">
          <img
            src={product.img}
            alt={product.title}
            className="w-full max-w-xl h-auto object-cover rounded-lg shadow-lg"
          />
          {/* Image Thumbnails (optional) */}
          <div className="flex gap-4 mt-4">
            {[...Array(3)].map((_, index) => (
              <img
                key={index}
                src={product.img}
                alt={`thumbnail-${index}`}
                className="h-20 w-20 object-cover rounded-md cursor-pointer transition-transform transform hover:scale-110"
              />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6 flex-1">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{product.title}</h2>
            {/* Wishlist Icon */}
            <FaHeart className="text-2xl text-gray-600 dark:text-white cursor-pointer mr-6 sm:ml-6 hover:text-red-500 transition-colors" />
          </div>

          <p className="text-lg text-gray-700 dark:text-gray-300">Color: <span className="font-semibold">{product.color}</span></p>

          {/* Rating */}
          <div className="flex items-center space-x-2 text-yellow-500">
            {[...Array(5)].map((_, index) => (
              <FaStar key={index} className={index < product.rating ? 'text-yellow-400' : 'text-gray-300'} />
            ))}
            <span className="text-gray-600 dark:text-gray-300">({product.rating})</span>
          </div>

          {/* Price Section */}
          <div className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">
            <span className="text-primary">₹{product.price ? product.price : 'Price not available'}</span>
          </div>

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Select Size</h3>
            {/* Check if sizes are available for this product */}
            {product.sizes && product.sizes.length > 0 ? (
              <div className="flex gap-4 mt-2">
                {product.sizes.map((size, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={selectedSize === size}
                      onChange={() => handleSizeChange(size)}
                      className="form-radio text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{size}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">No sizes available</p>
            )}
          </div>

          {/* Add to Cart and Buy Now Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="w-full py-3 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
              <FaShoppingCart /> Add to Cart
            </button>
            <button className="w-full py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
              <FaShoppingBag /> Buy Now
            </button>
          </div>

          {/* Product Description */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Product Description</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{product.description ? product.description : 'Description not available'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
