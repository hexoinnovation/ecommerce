import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaShoppingCart, FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  deleteDoc, onSnapshot ,
} from "firebase/firestore"; // Firestore functions
import { getAuth } from "firebase/auth"; // Firebase Auth
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const CartDrawer = ({ isOpen, closeDrawer }) => {
  const [userCartItems, setUserCartItems] = useState([]); 
  const [isEmpty, setIsEmpty] = useState(false); 
  const[product,setproduct]=useState("");
  const auth = getAuth(); // Firebase Auth instance
  const db = getFirestore(); // Firestore instance
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    // Function to listen to real-time updates of the cart from Firestore
    const fetchCartFromFirestore = () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.email);
        const cartRef = collection(userDocRef, "AddToCart");

        // Listen for changes to the cart collection in real-time
        const unsubscribe = onSnapshot(cartRef, (cartSnapshot) => {
          if (!cartSnapshot.empty) {
            const cartData = cartSnapshot.docs.map((doc) => doc.data());
            setUserCartItems(cartData);
            setIsEmpty(false);
          } else {
            setUserCartItems([]);
            setIsEmpty(true);
          }
        });

        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
      }
    };

    if (auth.currentUser) {
      fetchCartFromFirestore();
    }
  }, [auth.currentUser]);


  // Calculate the total price of the cart
  const calculateTotal = () => {
    return userCartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  const handleRemoveFromCart = async (itemId) => {
    console.log("Removing item with ID:", itemId); // Debugging log
    const user = auth.currentUser;
    if (!user) {
      console.error("No user is logged in. Cannot remove item.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.email);
      const cartRef = collection(userDocRef, "AddToCart");
      const itemDocRef = doc(cartRef, itemId.toString());

      await deleteDoc(itemDocRef);
      console.log("Item removed from Firestore:", itemId);

      // Update local state to reflect removal
      setUserCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== itemId);
        setIsEmpty(updatedItems.length === 0); // Check if cart is empty after removal
        return updatedItems;
      });
    } catch (error) {
      console.error("Error removing item from Firestore:", error);
    }
  };
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-90 transition-all duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      onClick={closeDrawer}
    >
      {/* Cart Drawer */}
      <div
        className={`absolute top-0 right-0 bg-white w-4/5 md:w-1/3 h-full p-6 overflow-y-auto transition-all duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="flex justify-between items-center mb-6">
          <FaShoppingCart className="text-3xl text-primary" />
          <h2 className="text-xl font-bold text-black">Your Cart</h2>
          <button className="text-xl text-black font-bold" onClick={closeDrawer}>
            X
          </button>
        </div>

        {/* Cart Content */}
        {isEmpty ? (
          <div className="flex flex-col justify-center items-center">
            <FaShoppingCart className="text-6xl text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-600">
              Your cart is empty.
            </h3>
            <Link to="/view-all" className="mt-4 text-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div>
            {userCartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-gray-100 p-4 mb-4 rounded-lg shadow-md"
              >
                <div className="flex items-center">
                <img
  src={item.image}
  alt={item.title}
  className="w-16 h-16 object-cover rounded-md"
  onClick={() => {
    console.log("Product ID:", item.id);
    handleProductClick(item.id);
  }}
/>

                  <div className="ml-4 text-black">
                    <h3 className="text-lg font-semibold ">{item.title}</h3>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <h3 className="text-sm font-semibold">{item.category}</h3>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Cart Footer */}
        <div className="mt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{calculateTotal()}</span>
          </div>
          <div className="mt-4 flex justify-between">
            <Link
              to="/cart"
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
