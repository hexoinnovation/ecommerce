import React from 'react';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaEye } from 'react-icons/fa'; // Import the FaEye icon
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart(); // Get cart items and remove function
  const navigate = useNavigate();

  // Calculate the total price by summing the price of each item * quantity
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Define a fixed shipping charge
  const shippingCharge = 50;

  // Calculate the final total (product total + shipping charge)
  const finalTotal = totalPrice + shippingCharge;

  // Handle the navigation to checkout page
  const handleCheckout = () => {
    navigate('/checkout'); // Replace with your checkout page route
  };

  // Handle the back navigation to the products list page
  const handleContinueShopping = () => {
    navigate('/view-all'); // Redirect to the products page
  };

  // Handle the back navigation to the specific product detail page
  const handleBackToProductDetails = (id) => {
    navigate(`/product/${id}`); // Redirect to the product detail page using the product's ID
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-0 py-8">
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          {/* Continue Shopping Button */}
          <button
            onClick={handleContinueShopping}
            className="text-xl text-primary dark:text-white flex items-center gap-2"
          >
            <FaArrowLeft className="text-lg" /> Continue Shopping
          </button>
        </div>

        <h2 className="text-4xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
          Your Shopping Cart
        </h2>

        {/* Cart Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Cart Items */}
          <div className="flex-1 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-300">
                <FaShoppingCart className="text-6xl mb-4" />
                <p>Your cart is empty.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-shadow"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-6">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md border border-gray-200"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-gray-800 dark:text-white text-lg font-semibold">
                          ₹{item.price * item.quantity}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-4">
                          Quantity : {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Back to Product Details Button with Eye Icon */}
                    <button
                      onClick={() => handleBackToProductDetails(item.id)}
                      className="text-xl text-blue-600 dark:text-white flex items-center gap-2 ml-4"
                    >
                      <FaEye className="text-lg" /> View Details
                    </button>

                    {/* Remove from cart */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTrash className="text-2xl" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Side - Total Section */}
          <div className="lg:w-80 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Cart Summary</h3>

            {/* Price and Shipping Information */}
            {cartItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between text-lg font-medium text-gray-900 dark:text-white">
                  <h4>Subtotal</h4>
                  <span>₹{totalPrice}</span>
                </div>

                {/* Shipping Charge */}
                <div className="flex justify-between text-lg font-medium text-gray-900 dark:text-white">
                  <h4>Shipping</h4>
                  <span>₹{shippingCharge}</span>
                </div>

                {/* Final Total */}
                <div className="flex justify-between text-2xl font-semibold text-gray-900 dark:text-white border-t pt-4">
                  <h4>Total</h4>
                  <span>₹{finalTotal}</span>
                </div>

                {/* Checkout Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 px-8 bg-primary text-white font-semibold rounded-lg shadow-xl hover:bg-primary-dark transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
