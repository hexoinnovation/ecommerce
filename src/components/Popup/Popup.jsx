import React, { useState } from 'react'; 
import { FaStar, FaShoppingCart, FaHeart, FaShoppingBag } from 'react-icons/fa';

const Popup = ({ product, onClose }) => { 
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) return null;

  const handleSizeChange = (size) => { 
    setSelectedSize(size); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl sm:max-w-lg lg:max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-h-[90vh] sm:max-h-[90vh] lg:max-h-[95vh]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl font-bold"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '2rem',
            zIndex: 60, 
          
          }}
        >
          &times;
        </button>

        {/* Scrollable content wrapper */}
        <div className="mt-16 sm:mt-5 mb-12 container px-4 lg:px-16 dark:bg-gray-900 dark:text-white overflow-auto max-h-[80vh] sm:max-h-[80vh] lg:max-h-[90vh]">
          <div className="flex flex-col lg:flex-row gap-8 flex-wrap">
            
            {/* Product Image and Thumbnails */}
            <div className="flex flex-col items-center lg:items-start mb-8 lg:mb-0">
              <img
                src={product.img}
                alt={product.title}
                className="w-full max-w-sm lg:max-w-md h-auto object-cover rounded-lg shadow-lg"
              />
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

            {/* Product Details */}
            <div className="space-y-6 flex-1 overflow-y-auto">
              {/* Title and Favorite Icon */}
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{product.title}</h2>
                <FaHeart className="text-2xl text-gray-600 dark:text-white cursor-pointer mr-6 sm:ml-6 hover:text-red-500 transition-colors" />
              </div>

              {/* Color and Rating */}
              <p className="text-lg text-gray-700 dark:text-gray-300">Color: <span className="font-semibold">{product.color}</span></p>
              <div className="flex items-center space-x-2 text-yellow-500">
                {[...Array(5)].map((_, index) => (
                  <FaStar key={index} className={index < product.rating ? 'text-yellow-400' : 'text-gray-300'} />
                ))}
                <span className="text-gray-600 dark:text-gray-300">({product.rating})</span>
              </div>

              {/* Price */}
              <div className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">
                ₹{product.price}
              </div>

              {/* Size Selector */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Select Size</h3>
                {product.sizes?.length > 0 ? (
                  <div className="flex gap-4 mt-2 flex-wrap">
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
              <div className="flex gap-4 mt-6 flex-wrap">
                <button className="w-full sm:w-70 py-3 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                  <FaShoppingCart /> Add to Cart
                </button>
                <button className="w-full sm:w-70 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                  <FaShoppingBag /> Buy Now
                </button>
              </div>

              {/* Product Description */}
              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Product Description</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
