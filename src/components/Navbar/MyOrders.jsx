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
      <div className="container mx-auto p-6">
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
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Order ID:{" "}
                  <span className="text-green-500">{order.id}</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  <strong>Items:</strong> {order.totalItems}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  <strong>Final Total:</strong>{" "}
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ₹{order.finalTotal}
                  </span>
                </p>
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
