import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { collection, getDocs, doc } from "firebase/firestore";
import Navbar from "./Navbar";
import Footer from "../Footer/Footer";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

const MyOrders = () => {
  const [cartOrders, setCartOrders] = useState([]);
  const [buyNowOrders, setBuyNowOrders] = useState([]);
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

        // Reference to the user's "Cart order" and "BuyNow order" collections
        const userDocRef = doc(db, "users", userEmail);
        const cartCollectionRef = collection(userDocRef, "Cart order");
        const buynowCollectionRef = collection(userDocRef, "buynow order");

        // Fetch data from both collections
        const [cartSnapshot, buynowSnapshot] = await Promise.all([
          getDocs(cartCollectionRef),
          getDocs(buynowCollectionRef)
        ]);

        // Map and set Cart Orders
        const fetchedCartOrders = cartSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          orderType: 'Cart', // Marking order type as "Cart"
        }));
        setCartOrders(fetchedCartOrders);

        // Map and set BuyNow Orders
        const fetchedBuyNowOrders = buynowSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          orderType: 'BuyNow', // Marking order type as "BuyNow"
        }));
        setBuyNowOrders(fetchedBuyNowOrders);

      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrders();
  }, [userEmail]);


  // Fetch orders from Firestore
useEffect(() => {
  const fetchOrders = async () => {
    try {
      if (!userEmail) {
        console.error("User email not available");
        return;
      }

      // Reference to the user's "BuyNow order" collection
      const userDocRef = doc(db, "users", userEmail);
      const buynowCollectionRef = collection(userDocRef, "buynow order");

      // Fetch BuyNow orders
      const buynowSnapshot = await getDocs(buynowCollectionRef);
      const fetchedBuyNowOrders = buynowSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        orderType: "BuyNow",  // Marking order type as "BuyNow"
      }));

      // Update state with BuyNow orders
      setBuyNowOrders(fetchedBuyNowOrders);
    } catch (error) {
      console.error("Error fetching BuyNow orders:", error.message);
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

        {/* Cart Orders Section */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Cart Orders</h2>
          {cartOrders.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                No Cart Orders found.
              </p>
            </div>
          ) : (
            cartOrders.map((order) => (
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
                      <strong>Order Type:</strong> {order.orderType}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Total Amount:</strong>{" "}
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ₹{order.totalAmount}
                      </span>
                    </p>
                  </div>

                  {/* Right Section */}
                  <div className="text-right">
                    {/* <p className="text-blue-600 dark:text-gray-300">
                      <strong>Order Date:</strong>{" "}
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p> */}
                    <p className="text-blue-600 dark:text-gray-300">
                      <strong>Order Date:</strong> {order.orderDate}
                    </p>
                    <p className="text-gray-600 text-red-600 dark:text-gray-300">
                      <strong>Payment Method:</strong> {order.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Render Cart Items */}
                {order.cartItems && order.cartItems.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-blod text-center">
                      Cart Items
                    </h3>
                    <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
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
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* BuyNow Orders Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">BuyNow Orders</h2>
          {buyNowOrders.length === 0 ? (
  <div className="flex items-center justify-center h-64">
    <p className="text-xl text-gray-500 dark:text-gray-400">
      No BuyNow Orders found.
    </p>
  </div>
) : (
  buyNowOrders.map((order) => (
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
            <strong>Order Type:</strong> {order.orderType}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Total Amount:</strong>{" "}
            <span className="font-bold text-green-600 dark:text-green-400">
              ₹{order.totalamount || "N/A"}
            </span>
          </p>
        </div>

        <div className="text-right">
  <p className="text-blue-600 dark:text-gray-300">
    <strong>OrderDate:</strong> {order.orderdate || "N/A"}
  </p>
  <p className="text-gray-600 text-red-600 dark:text-gray-300">
    <strong>Payment Method:</strong> {order.paymentmethod || "N/A"}
  </p>

  <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-blod text-center">
                      Buynow Items
                    </h3>
<div className=" items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-md  text-left dark:bg-gray-800 p-6 border border-gray-300  ml-80 w-fit mx-auto">
<p className="text-gray-600 dark:text-gray-300">
</p>
{order.image ? (
  <img
    src={order.image}
    alt="Order Image"
    className="w-32 h-32 object-cover rounded-md shadow-md"
  />
) : (
  <p className="text-gray-600 dark:text-gray-300">No Image Available</p>
)}
    <p className="text-gray-600 dark:text-gray-300">
      <strong>Product Name:</strong> {order.productname || "N/A"}
    </p>
    <p className="text-gray-600 dark:text-gray-300">
      <strong>Quantity:</strong> {order.Quantity || "N/A"}
    </p>
    <p className="text-gray-600 dark:text-gray-300">
      <strong>Price:</strong> {order.Price || "N/A"}
    </p>
    <p className="text-gray-600 dark:text-gray-300">
      <strong>Discount:</strong> {order.discount || "N/A"}
    </p>
  </div>

</div>


       
        
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
