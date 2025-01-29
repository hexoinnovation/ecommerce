import React, { useState,useEffect } from "react"; 
import { FaStar, FaShoppingCart, FaHeart, FaShoppingBag ,FaTimes,FaUser,FaLock, FaSignInAlt,FaCheckCircle,FaTimesCircle} from "react-icons/fa"; 
import { useCart } from "../../context/CartContext"; // Import useCart to access Cart context
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authcontext"; // Import the Auth context
import { UserCircleIcon } from '@heroicons/react/outline';  // or @heroicons/react/solid
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase"; // Your firebase configuration
import { getFirestore, doc, setDoc,getDoc,deleteDoc } from "firebase/firestore";
import {collection } from 'firebase/firestore';
//import { getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Popup = ({ product, onClose }) => {
  const navigate = useNavigate();
  
  const { addToCart } = useCart(); 

  const { isLoggedIn } = useAuth(); 
  const [quantity, setQuantity] = useState(1); 
  const [loginPrompt, setLoginPrompt] = useState(false); 
  const [error, setError] = useState('');  // Add state for error message
  const [successMessage, setSuccessMessage] = useState(''); // Success message
  const [errorMessage, setErrorMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useAuth();
  if (!product) return null; // Ensure product exists before rendering
  const db = getFirestore(app);
  const auth = getAuth(app);
  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      setLoginPrompt(true); // Show login prompt if not logged in
    } else {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
  
      if (user) {
        const productToAdd = {
          ...product,
          quantity,
        };
        setCartItems((prevItems) => [...prevItems, productToAdd]); // Update local cart state
  
        try {
          const userCartRef = collection(db, 'users', user.email, 'AddToCart');
          await setDoc(doc(userCartRef, product.id.toString()), productToAdd);
          setSuccessMessage('Your product has been added to the cart successfully!');
          incrementCartCount(); // Increment only after successful addition to Firestore
          navigate('/cart');
        } catch (error) {
          console.error('Error adding product to Firestore:', error);
          setErrorMessage('Failed to add product to the cart.');
        }
      }
    }
  };
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      setLoginPrompt(true); // Show login prompt if not logged in
    } else {
      const productToAdd = { 
        ...product, 
        quantity 
      };
      addToCart(productToAdd); // Add the product to the cart context
      
      navigate("/checkout", { state: { product: productToAdd } });
 // Redirect to Checkout page directly
    }
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
  
 // Toggle modal visibility
 const handleModalToggle = () => {
  handleDropdownClick()
  setShowModal(!showModal); // Toggle modal visibility
};
const handleDropdownClick = () => {
  // Implement the logic for dropdown click here (if needed)
  console.log("Dropdown clicked!");
};

const [isSignup, setIsSignup] = useState(false);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [username, setUsername] = useState('');
const [showModal, setShowModal] = useState(false); // Initially set to false
const { incrementCartCount } = useAuth();

const handleSignup = async () => {
  setError('');
  setSuccessMessage('');

  if (!email || !password || !username) {
    setError('Please fill in all fields.');
    return;
  }
  if (password.length < 6) {
    setError('Password must be at least 6 characters.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save the username in Firestore during signup
    const userDocRef = doc(db, 'users', email);
    await setDoc(userDocRef, {
      email: user.email,
      username: username, // Set the provided username
      createdAt: new Date(),
      lastLogin: new Date(),
    });

    setSuccessMessage('Account created successfully! Please log in.');
    setIsSignup(false); // Switch to login form

  } catch (error) {
    console.error("Signup Error: ", error); // Log error
    setError(error.message || 'An error occurred. Please try again.');
  }
};

const handleLogin = async () => {
  setError(''); // Reset error message
  setSuccessMessage(''); // Reset success message

  if (!email || !password) {
    setError('Please fill in all fields.');
    return;
  }

  try {
    // Log in the user with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if the user document exists in Firestore
    const userDocRef = doc(db, 'users', user.email); // Use user.email as the ID
    const userDocSnap = await getDoc(userDocRef);

    let fetchedUsername = ''; // Default to empty string

    if (userDocSnap.exists()) {
      // If user document exists, get the username from Firestore
      const userData = userDocSnap.data();
      fetchedUsername = userData.username || 'Default Username'; // Fallback to 'Default Username'
    } else {
      // If no user document exists, create one with a default username
      fetchedUsername = 'Default Username'; // Default username for new users
      await setDoc(userDocRef, {
        email: user.email,
        username: fetchedUsername, // Store default username
        createdAt: new Date(),
        lastLogin: new Date(),
      });
    }

    // Set user data to state
    setUsername(fetchedUsername);
    setIsAuthenticated(true);
    
    setSuccessMessage('Login successful!');
    setShowModal(false); // Close modal after login

    // Store authentication state and username in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', fetchedUsername);
    localStorage.setItem('userEmail', user.email); // Optionally store email as well

  } catch (error) {
    console.error("Login Error: ", error);
    setError(error.message || 'An error occurred. Please try again.');
  }
};
const [isWishlist, setIsWishlist] = useState(false); // Local state for wishlist toggle
const [wishlist, setWishlist] = useState([]); // Default to array

const handleWishlistToggle = async () => {
  if (!currentUser) {
    alert('Please login to add products to your wishlist.');
    return;
  }

  try {
    // Ensure the ID is converted to a string
    const wishlistRef = doc(db, 'users', currentUser.email, 'Wishlist', String(product.id));

    // Check if the product is already in the wishlist
    const docSnap = await getDoc(wishlistRef);

    if (docSnap.exists()) {
      // If the product is already in the wishlist, remove it
      await deleteDoc(wishlistRef);
      setIsWishlist(false);
    } else {
      console.log('Product being added to wishlist:', product); // Debug log
      await setDoc(wishlistRef, product);
      setIsWishlist(true);
    }
  } catch (error) {
    console.error('Error updating wishlist:', error);
  }
};

useEffect(() => {
  const checkWishlist = async () => {
    if (currentUser) {
      const wishlistRef = doc(db, 'users', currentUser.email, 'Wishlist', product.id);
      const docSnap = await getDoc(wishlistRef);
      setIsWishlist(docSnap.exists());
    }
  };
  checkWishlist();
}, [currentUser, product.id]);

const closeModal = () => {
  setLoginPrompt(false);
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
                src={product.image}
                alt={product.title}
                className="w-full max-w-sm lg:max-w-md h-auto object-cover rounded-lg shadow-lg"
              />
              <div className="flex gap-4 mt-4">
                {[...Array(3)].map((_, index) => (
                  <img
                    key={index}
                    src={product.image}
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
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{product.name}</h2>
                <button
      onClick={handleWishlistToggle}
      className={`text-2xl ${isWishlist ? 'text-red-500' : 'text-gray-500'}`}
    >
      <FaHeart />
    </button>
              </div>

              <div className="flex items-center space-x-2">
  <span className="font-medium text-gray-700 dark:text-gray-400">Color:</span>
  {/* <span className="text-sm text-gray-600 dark:text-gray-300">{product.color}</span> */}
  <div
    className="w-6 h-6 rounded-full"
    style={{ backgroundColor: product.color.toLowerCase() }}
  ></div>
</div>
              {/* <div className="flex items-center space-x-2 text-yellow-500">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < product.rating ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
                <span className="text-gray-600 dark:text-gray-300">({product.rating})</span>
              </div> */}

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
                 onClick={() => handleAddToCart(product)}// Trigger the add to cart function
                  className="w-full sm:w-70 py-3 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                 
                <button onClick={handleBuyNow}
                className="w-full sm:w-70 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                  <FaShoppingBag /> Buy Now
                </button>
              </div>
 {/* Success or Error Message */}
{successMessage && (
  <div className="flex items-center bg-white-500 text-yellow-800 p-3 rounded-lg shadow-lg mb-4 animate-slideIn">
  <FaShoppingCart className="mr-3 text-7xl animate-bounce" />
  <div className="flex flex-col">
    <p className="text-center text-lg font-bold">{successMessage}</p>
  </div>
</div>
)}

{error && (
  <div className="flex items-center bg-red-500 text-white p-4 rounded-lg shadow-lg mb-4 animate-slideIn">
    <FaTimesCircle className="mr-3 text-2xl" />
    <p className="text-center text-lg">{error}</p>
  </div>
)}
              {/* Product Description */}
              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Product Description</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* Login Prompt */}
  {loginPrompt && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8 rounded-md shadow-lg relative">
        
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-2 right-2 text-gray-900 hover:text-gray-700"
        aria-label="Close Modal"
      >
        <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
      </button>

      <h2 className="text-xl font-semibold">Please log in to access your products.</h2>
      
      {/* Go to Login Button */}
      <button 
        className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-700 transition-colors mt-4"
        onClick={() => {
          handleModalToggle();  // Close the modal and open the login prompt
          setLoginPrompt(false); // Close the login prompt
        }}
      >
        <UserCircleIcon className="w-5 h-5 mr-2" />
        Go to Login
      </button>
    
    </div>
  </div>
)}


{/* Show Login Modal after clicking "Go to Login" */}
{showModal && !isAuthenticated && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white p-10 rounded-lg w-96 shadow-lg relative">
      {/* Close button */}
      <button onClick={closeModal} className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700">
        <FaTimes className="text-xl" />
      </button>
   
      <h2 className="text-3xl mb-6 text-center font-bold text-gray-800 font-serif">{isSignup ? 'Sign Up' : 'Login'}</h2>
      {/* Login or Signup Form */}
      <form onSubmit={(e) => {
        e.preventDefault();
        isSignup ? handleSignup() : handleLogin();
      }}>
        {/* Email Field */}
        <div className="mb-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-4 text-black-400" />
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-black"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-4 text-black-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-black"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-black-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-black"
              required
            />
          </div>
        </div>
    
        {/* Submit Button */}
        <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-orange-600 text-white p-3 rounded-lg flex items-center justify-center space-x-2">
          <FaSignInAlt />
          <span>{isSignup ? 'Sign Up' : 'Login'}</span>
        </button>
      
      </form>

      {/* Switch to Sign Up / Login */}
      <p className="text-sm mt-4 text-center text-gray-600">
        {isSignup ? (
          <>
            Already have an account?{' '}
            <button onClick={() => setIsSignup(false)} className="text-blue-500 hover:underline">Login</button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button onClick={() => setIsSignup(true)} className="text-blue-500 hover:underline">Sign Up</button>
          </>
        )}
      </p>   
    </div>
  </div>
)}     
    </div>
  );
};

export default Popup;
