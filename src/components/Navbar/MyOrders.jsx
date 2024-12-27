import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { collection, getDocs, doc } from "firebase/firestore";
import Navbar from "./Navbar";
import Footer from "../Footer/Footer";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const auth = getAuth();
  const userEmail = auth.currentUser?.email;

  // Fetch orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userEmail) {
          console.error("User email not available");
          return;
        }

        // Reference to the user's "Cart order" collection
        const userDocRef = doc(db, "users", userEmail);
        const cartCollectionRef = collection(userDocRef, "Cart order");

        // Get all orders in the "Cart order" collection
        const querySnapshot = await getDocs(cartCollectionRef);
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include document ID
          ...doc.data(), // Spread document data
        }));

        setOrders(fetchedOrders); // Update state with fetched orders
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrders();
  }, [userEmail]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6 w-600">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 dark:text-white">
          My Orders
          <FaShoppingCart className="inline-block ml-2 text-3xl text-green-500 animate-pulse" />
        </h1>

        {/* Orders List */}
        <div className="space-y-6">
 {orders.length === 0 ? (
    <div className="flex items-center justify-center h-64">
      <p className="text-xl text-gray-500 dark:text-gray-400">
        No orders found.
      </p>
    </div>
  ) : (
    orders.map((order) => (
      <div
        key={order.id}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-green-500"
      >
        
        <div className="flex justify-between mt-2">
          {/* Left Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Order ID:{" "}
              <span className="text-green-500">{order.id}</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Items:</strong> {order.totalItems}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Final Total:</strong>{" "}
              <span className="font-bold text-green-600 dark:text-green-400">
                ₹{order.finalTotal}
              </span>
            </p>
          </div>

          {/* Right Section */}
          <div className="text-right">
          <p className="text-blue-600 dark:text-gray-300">
  <strong>Order Date:</strong>{" "}
  {new Date(order.orderDate).toLocaleDateString()}
</p>
            <p className="text-gray-600 text-red-600 dark:text-gray-300">
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
          </div>
        </div>
        {/* <p className="text-gray-600 dark:text-gray-300 mt-2">
          <strong>Final Total:</strong>{" "}
          <span className="font-bold text-green-600 dark:text-green-400">
            ₹{order.finalTotal}
          </span>
        </p> */}

{/* Render Cart Items */}
<div className="mt-4">
<h3 className="text-lg font-semibold text-gray-800 dark:text-white text-blod text-center">
    Cart Items
  </h3>
  {order.cartItems && order.cartItems.length > 0 ? (
    <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"> {/* Use grid layout */}
      {order.cartItems.map((item, index) => (
        <li
          key={index}
          className="flex items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-md"
        >
          {/* Image */}
          <div className="w-16 h-16 mr-4 flex-shrink-0">
            <img
              src={item.image}
              alt={item.productName}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          {/* Product Details */}
          <div className="text-sm">
            <p className="text-gray-800 dark:text-gray-200 font-bold truncate">
              {item.productName}
            </p>
            <p className="text-gray-600 dark:text-gray-300 truncate">
              <strong>Category:</strong> {item.category}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Quantity:</strong> {item.quantity}
            </p>
            <p className="text-gray-800 dark:text-gray-200 font-semibold">
              <strong>Price:</strong> ₹{item.price}
            </p>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-600 dark:text-gray-300 mt-1 text-center">
      No cart items found for this order.
    </p>
  )}
</div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;
