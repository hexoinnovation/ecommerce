import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { db, doc, collection, getDocs } from "../firebase";
import { FaShoppingCart } from 'react-icons/fa';  // Import shopping cart icon

const MyOrders = () => {
  const [user, setUser] = useState(null); // State to store the authenticated user
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the authenticated user
      } else {
        setUser(null); // User is not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        console.error('User not authenticated');
        setLoading(false);
        return;
      }
      try {
        // Fetch the user's orders from Firestore
        const userDocRef = doc(db, 'users', user.email);
        const cartOrderRef = collection(userDocRef, 'buynow order');
        const querySnapshot = await getDocs(cartOrderRef);

        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="text-center p-4">Loading orders...</div>;
  }

  if (!orders.length) {
    return <div className="text-center p-4">No orders found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        My Orders
        <FaShoppingCart className="inline-block ml-2 text-xl animate-pulse" />
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">Order ID: {order.id}</h2>
            <div className="text-sm mb-2">
              <strong>Total Items:</strong> {order.totalItems}
            </div>
            <div className="text-sm mb-2">
              <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}
            </div>
            <div className="text-sm mb-2">
              <strong>Final Total:</strong> {order.finalTotal} USD
            </div>
            <div className="text-sm mb-2">
              <strong>Shipping Address:</strong> {order.shippingAddress?.city || 'N/A'}
            </div>
            <div className="text-sm mb-2">
              <strong>Billing Address:</strong> {order.billingAddress?.city || 'N/A'}
            </div>
            <h3 className="text-lg font-semibold">{order.name}</h3>
                <h3 className="text-lg font-semibold">{order.category}</h3>
                <p className="text-gray-600 dark:text-gray-400">₹{order.price}</p>
                <p className="text-gray-600 dark:text-gray-400">Qty: {order.quantity}</p>
            <div className="mt-4">
              <strong>Cart Items:</strong>
              <ul className="space-y-2">
                {Array.isArray(order.cartItems) && order.cartItems.length > 0 ? (
                  order.cartItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-all"
                    >
                      <img
                        src={item.image || 'default-image-url'} // Assuming the item object has an image
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <span className="font-semibold">{item.name}</span> - 
                        {item.quantity} x {item.price} USD
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No items in the cart</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
