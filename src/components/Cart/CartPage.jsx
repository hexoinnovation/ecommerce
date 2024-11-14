import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaShoppingCart, FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Access Cart Context
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'; // Firestore functions
import { getAuth } from 'firebase/auth'; // Firebase Auth

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart(); // Get cart items and remove function
  const [userCartItems, setUserCartItems] = useState(cartItems); // State for storing cart items from Firestore
  const [isEmpty, setIsEmpty] = useState(false); // State to check if cart is empty
  const auth = getAuth(); // Firebase Auth instance
  const db = getFirestore(); // Firestore instance
  const [loading, setLoading] = useState(true); // State to handle loading state

  // Calculate the total price of the cart
  const calculateTotal = () => {
    return userCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Store cart items under the current logged-in user's email
  const storeCartInFirestore = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.email); // User's document
        const cartRef = collection(userDocRef, 'AddToCart'); // AddToCart subcollection

        // Store cart items in Firestore
        for (const item of userCartItems) {
          await setDoc(doc(cartRef, item.id.toString()), {
            ...item,
            addedAt: new Date(),
          });
        }
        console.log('Cart stored in Firestore');
      } catch (error) {
        console.error('Error storing cart in Firestore:', error);
      }
    }
  };

  // Fetch cart items from Firestore
  const fetchCartFromFirestore = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.email); // User's document
        const cartRef = collection(userDocRef, 'AddToCart'); // AddToCart subcollection
        const cartSnapshot = await getDocs(cartRef); // Fetch all cart items

        if (!cartSnapshot.empty) {
          const cartData = cartSnapshot.docs.map(doc => doc.data());
          setUserCartItems(cartData); // Set cart items from Firestore
          setIsEmpty(false); // Set isEmpty to false if there are items
        } else {
          setUserCartItems([]); // In case there are no items in Firestore
          setIsEmpty(true); // Set isEmpty to true if the cart is empty
        }
      } catch (error) {
        console.error('Error fetching cart from Firestore:', error);
      }
    }
  };

  // Remove item from Firestore and local state
  const handleRemoveFromCart = async (itemId) => {
    const user = auth.currentUser; // Get the logged-in user
    if (!user) {
      console.error('No user is logged in. Cannot remove item.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.email); // User's document
      const cartRef = collection(userDocRef, 'AddToCart'); // Reference to the AddToCart subcollection
      const itemDocRef = doc(cartRef, itemId.toString()); // Document reference for the item

      // Delete the item document from Firestore
      await deleteDoc(itemDocRef);
      console.log('Item removed from Firestore:', itemId);

      // Remove the item from the local cart state (context or local state)
      setUserCartItems(prevItems => prevItems.filter(item => item.id !== itemId)); // Update local state to remove the item
      setIsEmpty(userCartItems.length === 1); // If only one item was removed, check if the cart is empty
    } catch (error) {
      console.error('Error removing item from Firestore:', error);
    }
  };

  // Fetch the cart when the component is mounted or when the user logs in
  useEffect(() => {
    if (auth.currentUser) {
      fetchCartFromFirestore(); // Fetch cart from Firestore when the user logs in
    } else {
      setUserCartItems([]); // Clear the cart if no user is logged in
      setIsEmpty(true); // Set the cart as empty if no user
    }
  }, [auth.currentUser]); // Only run when auth state changes

  // Sync the cart with Firestore whenever cart items change
  useEffect(() => {
    if (userCartItems.length > 0) {
      storeCartInFirestore(); // Store cart in Firestore whenever cart items are updated
    }
  }, [userCartItems]); // Dependency array ensures this runs when userCartItems change

  return (
    <div className="container mt-14 sm:mt-5 mx-auto px-4 sm:px-6 lg:px-16 py-8">
      {/* Cart Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaShoppingCart className="text-5xl text-primary mr-3" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Your Cart</h1>
        </div>
        {/* Back to Shop Button - Aligned to the Right */}
        <Link
          to="/"
          className="text-primary text-lg hover:text-primary-dark flex items-center space-x-2"
        >
          <FaChevronLeft className="mr-2" /> <span>Back to Shop</span>
        </Link>
      </div>

      {/* Cart Content (Items and Summary) */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section (Left Side) */}
        {isEmpty ? (
          <div className="flex flex-col justify-center items-center mt-10 w-full shadow-lg p-6 rounded-lg">
            <FaShoppingCart className="text-6xl text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mt-4">Your cart is empty.</h2>
            <Link
              to="/view-all"
              className="mt-4 text-primary text-lg hover:text-primary-dark flex items-center space-x-2"
            >
              <FaChevronLeft /> <span>Continue Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col space-y-6 lg:w-3/4">
            {userCartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-x-6"
              >
                {/* Link to Product Detail Page */}
                <Link to={`/product/${item.id}`} className="flex items-center space-x-6">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                </Link>

                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition duration-200"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Cart Summary Section (Right Side) */}
        {userCartItems.length > 0 && (
          <div className="mt-6 lg:w-1/4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Order Summary</h3>
            <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-white mb-2">
              <span>Subtotal</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-white mb-4">
              <span>Shipping</span>
              <span>₹0</span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 pt-4 flex justify-between text-2xl font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <button className="w-full mt-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
