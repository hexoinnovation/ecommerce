import React, { useState, useEffect } from 'react';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaEye ,  FaArrowRight} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../Authcontext'; // Access currentUser
import { useNavigate } from 'react-router-dom';
import { db, doc, collection, setDoc, deleteDoc } from '../firebase'; // Firestore methods

const CartPage = () => {
  const [step, setStep] = useState(0);
  const { cartItems, removeFromCart } = useCart();
  const { currentUser } = useAuth(); // Access currentUser from AuthContext
  const navigate = useNavigate();

  // Calculate the total price and final total
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCharge = 50;
  const finalTotal = totalPrice + shippingCharge;

  // Firestore reference for the user's cart subcollection
  const userCartRef = currentUser
    ? collection(doc(db, 'users', currentUser.email), 'cart')
    : null;

  // Sync cart items to Firestore whenever they change
  useEffect(() => {
    if (currentUser && userCartRef) {
      cartItems.forEach(async (item) => {
        await setDoc(doc(userCartRef, item.id), item); // Save each item by ID in Firestore
      });
    }
  }, [cartItems, currentUser]);

  // Remove item from Firestore when it's removed from the cart
  const handleRemoveFromCart = async (id) => {
    if (currentUser && userCartRef) {
      await deleteDoc(doc(userCartRef, id)); // Delete the item from Firestore
    }
    removeFromCart(id); // Remove from local state
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/view-all');
  };

  const handleBackToProductDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-0 py-8">
      <div className="container mx-auto p-4 max-w-7xl">
        <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
          <li className="flex items-center text-blue-600 dark:text-blue-500">
            <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
              1
            </span>
            Personal <span className="hidden sm:inline-flex sm:ms-2">Info</span>
            <svg
              className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 12 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m7 9 4-4-4-4M1 9l4-4-4-4"
              />
            </svg>
          </li>
          <li className="flex items-center text-blue-600 dark:text-blue-500">
            <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
              2
            </span>
            Account <span className="hidden sm:inline-flex sm:ms-2">Info</span>
            <svg
              className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 12 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m7 9 4-4-4-4M1 9l4-4-4-4"
              />
            </svg>
          </li>
          <li className="flex items-center text-blue-600 dark:text-blue-500">
            <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
              3
            </span>
            Shipping <span className="hidden sm:inline-flex sm:ms-2">Info</span>
            <svg
              className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 12 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m7 9 4-4-4-4M1 9l4-4-4-4"
              />
            </svg>
          </li>
          <li className="flex items-center text-blue-600 dark:text-blue-500">
            <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
              4
            </span>
            Review
          </li>
        </ol>

        <div className="mt-8">
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Info</h2>
              <form>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email Address</label>
                  <input
                    type="email"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Enter your email"
                  />
                </div>
              </form>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Info</h2>
              <form>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Choose a username"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
                  <input
                    type="password"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Enter a password"
                  />
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shipping Info</h2>
              <form>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Shipping Address</label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Enter your address"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone Number</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Enter your phone number"
                  />
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review</h2>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Items in Your Cart</h3>
                <ul className="mt-2">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between mb-2">
                      <div>
                        <strong>{item.name}</strong> x {item.quantity} - ${item.price}
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-red-600 dark:text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <div className="text-sm font-semibold">Total: ${totalPrice.toFixed(2)}</div>
                  <div className="text-sm font-semibold">Shipping: ${shippingCharge}</div>
                  <div className="text-lg font-bold">Final Total: ${finalTotal.toFixed(2)}</div>
                </div>
                <div className="mt-4">
                  <button onClick={handleCheckout} className="btn btn-primary">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={() => setStep((prevStep) => Math.max(0, prevStep - 1))}
              className="btn btn-outline mr-4"
            >
              <FaArrowLeft /> Back
            </button>
            {step < 3 && (
              <button
                onClick={() => setStep((prevStep) => Math.min(3, prevStep + 1))}
                className="btn btn-primary"
              >
                Next <FaArrowRight />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
