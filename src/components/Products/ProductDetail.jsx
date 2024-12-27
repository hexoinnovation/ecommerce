import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaShoppingCart, FaHeart, FaMoneyBillAlt } from 'react-icons/fa';
import { useProducts } from '../../context/ProductsContext';
import { useCart } from '../../context/CartContext'; // Import the useCart hook
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase"; // Your firebase configuration
import { getFirestore, doc, setDoc,getDoc,deleteDoc ,getDocs,query, limit} from "firebase/firestore";
import {collection } from 'firebase/firestore';
import { useAuth } from "../Authcontext"; // Import the Auth context
import { UserCircleIcon } from '@heroicons/react/outline';  // or @heroicons/react/solid
import {  FaShoppingBag ,FaTimes,FaUser,FaLock, FaSignInAlt,FaCheckCircle,FaTimesCircle} from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const products = useProducts(); // Get products from context
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { addToCart } = useCart(); // Get addToCart function from CartContext
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
        setLoginPrompt(true);
    } else {
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;

        if (user) {
            console.log("Product:", product);
            if (!product || !product.id) {
                console.error("Product or Product ID is undefined!");
                return;
            }

            const productId = product.id.toString();
            if (!quantity || quantity <= 0) {
                console.error("Invalid quantity:", quantity);
                setErrorMessage("Please select a valid quantity.");
                return;
            }

            const productInCart = cartItems.find((item) => item.id === product.id);
            if (productInCart) {
                setCartItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    )
                );
            } else {
                const productToAdd = { ...product, quantity };
                setCartItems((prevItems) => [...prevItems, productToAdd]);
            }

            try {
                const userCartRef = collection(db, "users", user.email, "AddToCart");
                await setDoc(doc(userCartRef, productId), { ...product, quantity });
                setSuccessMessage("Your product has been added to the cart successfully!");
                setTimeout(() => {
                  setSuccessMessage('');
                }, 2000); // 2000ms = 2 seconds
                incrementCartCount();
                navigate("/cart");
            } catch (error) {
                console.error("Error adding product to Firestore:", error);
                setErrorMessage("Failed to add product to the cart.");
            }
        }
    }
};

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      setLoginPrompt(true); 
    } else {
      const productToAdd = { 
        ...product, 
        quantity 
      };
      addToCart(productToAdd); 
      
      navigate("/checkout", { state: { product: productToAdd } });
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
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000); // 2000ms = 2 seconds
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
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000); // 2000ms = 2 seconds
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
const [mainImage, setMainImage] = useState("");
const [recommendedProducts, setRecommendedProducts] = useState([]);
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
 // const [wishlist, setWishlist] = useState([]); // Default to array

 const fetchProduct = async (id) => {
  try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() }; // Include the document ID
          setProduct(productData); // Set product with ID
          setMainImage(productData?.image);
          setLoading(false);
      } else {
          setError("Product not found.");
          setLoading(false);
      }
  } catch (error) {
      setError("Failed to fetch product details.");
      setLoading(false);
  }
};
const handleWishlistToggle = async () => {
  if (!currentUser) {
    alert('Please login to add products to your wishlist.');
    return;
  }

  try {
    const wishlistRef = doc(db, 'users', currentUser.email, 'Wishlist', String(product.id));

    // Check if the product is already in the wishlist
    const docSnap = await getDoc(wishlistRef);

    if (docSnap.exists()) {
      // If the product is already in the wishlist, remove it
      await deleteDoc(wishlistRef);
      setIsWishlist(false);
    } else {
      await setDoc(wishlistRef, product);
      setIsWishlist(true);
    }
  } catch (error) {
    console.error('Error updating wishlist:', error);
  }
};

// Check if the product is in the wishlist when the component mounts or when product or currentUser changes
useEffect(() => {
  const checkWishlist = async () => {
    if (currentUser && product) {
      const wishlistRef = doc(db, 'users', currentUser.email, 'Wishlist', product.id);
      const docSnap = await getDoc(wishlistRef);
      setIsWishlist(docSnap.exists());
    }
  };

  if (currentUser && product) {
    checkWishlist(); // Call checkWishlist only when currentUser and product are available
  }
}, [currentUser, product]); // Ensure this effect only runs when currentUser or product changes
const [zoomStyle, setZoomStyle] = useState({});
  const [isZoomVisible, setIsZoomVisible] = useState(false);

  // Mock angles with same image (replace with actual images if available)
  const angles = [
    { label: "", image: mainImage },
    { label: "", image: mainImage },
    { label: "", image: mainImage },
    { label: "", image: mainImage },
  ];

  // Magnifying Glass Logic
  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };
useEffect(() => {
  if (id) {
    setLoading(true); // Set loading to true when fetching starts
    fetchProduct(id); // Call fetchProduct with the correct 'id'
  }
}, [id]); 
const fetchRecommendedProducts = async () => {
  try {
    // Fetch all products from Firestore
    const querySnapshot = await getDocs(collection(db, "products"));

    let products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Shuffle the products to randomize them
    const shuffledProducts = products.sort(() => Math.random() - 0.5);

    // Select a limited number of products to display
    const limitedProducts = shuffledProducts.slice(0, 4);

    setRecommendedProducts(limitedProducts);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    setError("Failed to fetch recommended products.");
    setLoading(false);
  }
};

// Call fetch on component mount
useEffect(() => {
  fetchRecommendedProducts();
}, []);
const handleProductClick = (productId) => {
  navigate(`/product/${productId}`);
};

if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center">
              <span className="text-3xl text-yellow-500">🛒</span>
            </div>
          </div>    
          <div className="w-24 h-24 border-8 border-t-8 border-yellow-500 border-solid rounded-full animate-spin"></div>
        </div>
        <p className="text-xl font-semibold text-gray-700">Your Shop is loading...</p>
      </div>
    </div>
  );
}
if (error) {
  return <div>{error}</div>; // Show error message if an error occurred
}

  return (
    <div className="min-h-screen flex items-center justify-center sm:mt-0 mt-10 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto  p-1 max-w-7xl">
      <div className="container mx-auto p-6">
  {/* Main Product Section */}
  <div className="flex flex-col lg:flex-row gap-8">
    {/* Thumbnail Gallery */}
    <div className="flex flex-row lg:flex-col gap-4 items-start">
      {angles.map((angle, index) => (
        <div key={index} className="flex flex-col items-center mt-7">
          <img
            src={angle.image}
            alt={angle.label}
            className="h-20 w-20 object-cover rounded-md cursor-pointer transition-transform transform hover:scale-110 ml-10"
            onClick={() => setMainImage(angle.image)}
          />
          <p className="text-sm text-gray-500">{angle.label}</p>
        </div>
      ))}
    </div>

    {/* Main Image with Zoom */}
    <div
      className="relative group flex-1"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsZoomVisible(true)}
      onMouseLeave={() => setIsZoomVisible(false)}
    >
      <img
        src={mainImage}
        alt={product?.name || "Product"}
        className="w-full max-w-md h-100 object-cover rounded-xl shadow-lg ml-10"
      />
      {isZoomVisible && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover rounded-xl border-2 border-gray-300"
          style={{
            backgroundImage: `url(${mainImage})`,
            ...zoomStyle,
            backgroundSize: "200%",
          }}
        />
      )}
    </div>
  
    {/* Product Details */}
    <div className="flex-1 space-y-7">
    <div className="flex items-center justify-between">
    <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{product.name}</h2>
    <button
      onClick={handleWishlistToggle}
      className={`text-2xl mr-60 ${isWishlist ? 'text-red-500' : 'text-gray-500'}`}
    >
      <FaHeart />
    </button>
  </div>
  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100  mt-3 ">
          {product.category}
        </h3>
      <p className="text-lg text-gray-700 dark:text-gray-300 ">{product.description}</p>
      <div className="text-2xl font-semibold text-gray-800 dark:text-white">₹{product.price}</div>
      <div className="flex items-center space-x-2">
  <span className="font-medium text-gray-700 dark:text-gray-400">Color:</span>
  {/* <span className="text-sm text-gray-600 dark:text-gray-300">{product.color}</span> */}
  <div
    className="w-6 h-6 rounded-full"
    style={{ backgroundColor: product.color.toLowerCase() }}
  ></div>
</div>
<div className="mt-4">
  <span className="font-medium text-gray-700 dark:text-gray-400">Available Sizes:</span>
  <div className="flex space-x-2 mt-2">
    {/* Static sizes displayed as tags */}
    <span className="inline-block px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full">
      S
    </span>
    <span className="inline-block px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full">
      M
    </span>
    <span className="inline-block px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full">
      L
    </span>
    <span className="inline-block px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full">
      XL
    </span>
  </div>
  </div>
      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button onClick={handleDecrement} className="px-4 py-2 bg-gray-200 rounded-md">-</button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, e.target.value))}
          className="w-16 text-center border border-gray-300 rounded-md"
        />
        <button onClick={handleIncrement} className="px-4 py-2 bg-gray-200 rounded-md">+</button>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => handleAddToCart(product)}
          className="w-1/2 py-3 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
        >
          <FaShoppingCart /> Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="w-1/4 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <FaMoneyBillAlt /> Buy Now
        </button>
      </div>
        {/* Success or Error Message */}
 {successMessage && (
  <div className="flex items-center bg-white-500 text-yellow-800 p-3 rounded-lg shadow-lg mb-4 animate-slideIn">
  <FaShoppingCart className="mr-3 text-5xl animate-bounce" />
  <div className="flex flex-col">
    <p className="text-center text-xxl font-bold">{successMessage}</p>
  </div>
</div>
)}

    </div>
  </div>
  <div className="recommended-products mt-12">
  <div className="flex items-center justify-center mb-8">
    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-3">
      <span>People also want these</span>
      <span className="animate-bounce text-primary">
        <FaStar className="w-6 h-6" />
      </span>
    </h1>
  </div>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {recommendedProducts.map((product) => (
      <div
        key={product.id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col hover:shadow-xl transition-shadow duration-300"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[250px] object-cover rounded-md"  onClick={() => handleProductClick(product.id)}
        />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100  mt-3 ">
          {product.name}
        </h3>
       
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {product.description}
        </p>
        <div className="flex  space-x-2  mt-2">
          <span className="font-medium text-gray-700 dark:text-gray-400">
            Color:
          </span>
          <div
            className="w-5 h-5 rounded-full border"
            style={{ backgroundColor: product.color.toLowerCase() }}
          ></div>
        </div>
        <p className="text-lg font-bold text-gray-900 dark:text-white  mt-2">
          ₹{product.price}
        </p>
        <div className="flex justify-around  space-x-4 mt-4 mr-1">
          <button
            onClick={() => console.log(`Added ${product.name} to cart`)}
            className="flex   bg-primary text-xs text-white px-3 py-2 rounded-md shadow-md hover:bg-primary-dark transition"
          >
            <FaShoppingCart className="mr-1" />
            Add to Cart
          </button>
          <button
            onClick={() => console.log(`Buying ${product.name}`)}
            className="flex  bg-green-600 text-xs text-white px-3 py-2 rounded-md shadow-md hover:bg-green-700 transition"
          >
            <FaShoppingBag className="mr-1" />
            Buy Now
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

  </div>

          
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
  );
};

export default ProductDetail;
