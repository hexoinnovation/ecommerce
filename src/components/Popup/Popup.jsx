import React, { useState } from "react"; 
import { FaStar, FaShoppingCart, FaHeart, FaShoppingBag } from "react-icons/fa"; 
import { useCart } from "../../context/CartContext"; // Import useCart to access Cart context
import { useNavigate } from "react-router-dom";

const Popup = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Get addToCart function from the Cart context

  const [quantity, setQuantity] = useState(1); // State to track quantity

  if (!product) return null; // Ensure product exists before rendering

  // Handle Add to Cart
  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      quantity, // Include the selected quantity
    };

    addToCart(productToAdd); // Add the product to the cart using the addToCart function
    navigate('/cart'); // Redirect to the cart page after adding
  };

  // Add to cart and stay on the page (no redirect)
  const handleBuyNow = () => {
    const productToAdd = { 
      ...product, 
      quantity 
    };
    addToCart(productToAdd); // Add the product to the cart context
    navigate('/checkout'); // Redirect to Checkout page directly
  };

  // Increase quantity
  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  // Decrease quantity, ensuring it's at least 1
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl sm:max-w-lg lg:max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-h-[90vh] sm:max-h-[90vh] lg:max-h-[95vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl font-bold"
          style={{
            position: "absolute",
            top: "1rem",
            right: "2rem",
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
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Color: <span className="font-semibold">{product.color}</span>
              </p>
              <div className="flex items-center space-x-2 text-yellow-500">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < product.rating ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
                <span className="text-gray-600 dark:text-gray-300">({product.rating})</span>
              </div>

              {/* Price */}
              <div className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">
                ₹{product.price}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center mt-4">
                <button
                  onClick={decreaseQuantity}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300"
                >
                  -
                </button>
                <span className="mx-4 text-lg font-semibold">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              {/* Add to Cart and Buy Now Buttons */}
              <div className="flex gap-4 mt-6 flex-wrap">
                <button
                  onClick={handleAddToCart} // Trigger the add to cart function
                  className="w-full sm:w-70 py-3 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button onClick={handleBuyNow}
                className="w-full sm:w-70 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
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
