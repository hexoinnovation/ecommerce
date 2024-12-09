import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaShoppingCart, FaHeart, FaMoneyBillAlt } from 'react-icons/fa';
import { useProducts } from '../../context/ProductsContext';
import { useCart } from '../../context/CartContext'; // Import the useCart hook
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase"; // Your firebase configuration
import { getFirestore, doc, setDoc,getDoc,deleteDoc } from "firebase/firestore";
import {collection } from 'firebase/firestore';
import { useAuth } from "../Authcontext"; // Import the Auth context
import { UserCircleIcon } from '@heroicons/react/outline';  // or @heroicons/react/solid
import {  FaShoppingBag ,FaTimes,FaUser,FaLock, FaSignInAlt,FaCheckCircle,FaTimesCircle} from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';

const ProductDetail = () => {
  const products = useProducts(); // Get products from context
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  
  const { addToCart } = useCart(); // Get addToCart function from CartContext

  // Check if products are loaded
  if (!products) {
    return <div>Loading...</div>; // Or some loading spinner
  }

  const product = products.find((item) => item.id === parseInt(id, 10));

  if (!product) {
    return <div>Product not found.</div>;
  }

  const [mainImage, setMainImage] = useState(product?.img || '');
  
  const [quantity, setQuantity] = useState(1); // Quantity state

  const handleGoBack = () => {
    navigate('/view-all'); // Go back to the products list
  };

  
  const handleIncrement = () => {
    setQuantity((prev) => prev + 1); // Increment quantity
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1); // Decrement quantity (prevent going below 1)
    }
  };

  
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
      
      navigate('/checkout'); // Redirect to Checkout page directly
    }
  };
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
const { isLoggedIn } = useAuth(); 
const [loginPrompt, setLoginPrompt] = useState(false); 
const [error, setError] = useState('');  // Add state for error message
const [successMessage, setSuccessMessage] = useState(''); // Success message
const [errorMessage, setErrorMessage] = useState('');
const [isSignup, setIsSignup] = useState(false);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [username, setUsername] = useState('');
const [showModal, setShowModal] = useState(false); // Initially set to false  
const [cartItems, setCartItems] = useState([]);
const { incrementCartCount } = useAuth();
// Toggle modal visibility
const handleModalToggle = () => {
  handleDropdownClick()
  setShowModal(!showModal); // Toggle modal visibility
};
const handleDropdownClick = () => {
  // Implement the logic for dropdown click here (if needed)
  console.log("Dropdown clicked!");
};
// Close modal
const closeModal = () => {
  setShowModal(false); // Close the modal by setting showModal to false
};
const { currentUser } = useAuth(); // Access current user from AuthProvider
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
  
  return (
    <div className="min-h-screen flex items-center justify-center sm:mt-0 mt-10 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto  p-4 max-w-4xl">
        {/* <button
          onClick={handleGoBack}
          className="text-xl text-primary dark:text-white flex items-center gap-2 mb-4"
        >
          <FaArrowLeft className="text-lg" />
          Back to Shop
        </button> */}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="flex flex-col items-center lg:items-start mb-8 lg:mb-0">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full max-w-sm lg:max-w-md h-96 object-cover rounded-xl shadow-lg"
            />
            <div className="flex gap-4 mt-4">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-md cursor-pointer"
                  onClick={() => setMainImage(image)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{product.name}</h2>
              <button
      onClick={handleWishlistToggle}
      className={`text-2xl ${isWishlist ? 'text-red-500' : 'text-gray-500'}`}
    >
      <FaHeart />
    </button>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300">{product.description}</p>

            <div className="flex items-center space-x-2 text-yellow-500">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < product.rating ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
              <span className="text-gray-600 dark:text-gray-300">({product.rating})</span>
            </div>

            <div className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">
              ₹{product.price}
            </div>

            {/* Quantity Section */}
            <div className="flex items-center space-x-2 mt-4">
              <button
                onClick={handleDecrement}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                className="w-16 text-center border border-gray-300 rounded-md"
              />
              <button
                onClick={handleIncrement}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                +
              </button>
            </div>

            <div className="flex space-x-4 mt-6">
            <button
                 onClick={() => handleAddToCart(product)}// Trigger the add to cart function
                  className="w-1/2 sm:w-1/2 py-3 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Add to Cart
                </button>

              {/* Buy Now Button */}
              <button className="w-1/2 sm:w-36 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                <FaMoneyBillAlt /> Buy Now
              </button>
           
            </div>
            <button
  onClick={handleGoBack}
  className="text-xl text-primary dark:text-white flex items-center gap-2 mb-4 ml-40"
>
  <FontAwesomeIcon icon={faHandPointLeft} className="text-2xl" />
  Back to Shop
</button>
            {/* Success or Error Message */}
 {successMessage && (
  <div className="flex items-center bg-white-500 text-yellow-800 p-3 rounded-lg shadow-lg mb-4 animate-slideIn">
  <FaShoppingCart className="mr-3 text-7xl animate-bounce" />
  <div className="flex flex-col">
    <p className="text-center text-lg font-bold">{successMessage}</p>
  </div>
</div>
)}

{loginPrompt && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-8 rounded-md shadow-lg">
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
      
      {/* Close Button */}
      <button
        onClick={() => setLoginPrompt(false)}
        className="mt-4 py-2 px-6 bg-gray-300 text-gray-900 rounded-md"
      >
        Close
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
        </div>
      </div>
      
    </div>
  );
};

export default ProductDetail;
