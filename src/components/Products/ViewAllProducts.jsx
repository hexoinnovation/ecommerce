import React, { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaStar, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Sidebar } from "../Sidebar";
import { useAuth } from "../Authcontext"; // Import the Auth context
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc,deleteDoc,query,where } from "firebase/firestore";
export const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(8); // Default to 8
  const navigate = useNavigate();
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
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

//const { incrementCartCount } = useAuth();

const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false); // Initially set to false   
  // Fetch products from Firebase
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Adjust productsPerPage based on screen size
  const adjustProductsPerPage = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1024) {
      setProductsPerPage(8); // 8 for larger screens
    } else {
      setProductsPerPage(4); // 4 for smaller screens
    }
  };

  useEffect(() => {
    fetchProducts();
    adjustProductsPerPage(); // Set initial productsPerPage
    window.addEventListener("resize", adjustProductsPerPage); // Listen to resize events
    return () => window.removeEventListener("resize", adjustProductsPerPage);
  }, []);

  // const handleSubcategorySelect = (subcategory) => {
  //   setSelectedSubcategory(subcategory);
  //   setCurrentPage(1);
  // };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const filteredProducts = selectedSubcategory
    ? products.filter(
        (product) =>
          (product.subcategory || "").trim().toLowerCase() ===
          selectedSubcategory.trim().toLowerCase()
      )
    : products;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const incrementCartCount = () => {
    setCartCount((prevCount) => prevCount + 1); // Assuming `setCartCount` is a state setter
  };
  
  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      setLoginPrompt(true);
    } else {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
  
      if (user) {
        // Check if the product is already in the cart
        const productInCart = cartItems.find((item) => item.id === product.id);
        if (productInCart) {
          // Optionally, update the quantity if the product is already in the cart
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity } // Increment quantity by the selected quantity
                : item
            )
          );
        } else {
          const productToAdd = { ...product, quantity };  // Ensure you are using the quantity state correctly
          setCartItems((prevItems) => [...prevItems, productToAdd]); // Update local cart state
        }
  
        try {
          const userCartRef = collection(db, "users", user.email, "AddToCart");
          await setDoc(doc(userCartRef, product.id.toString()), { ...product, quantity });  // Save with the quantity
          setSuccessMessage("Your product has been added to the cart successfully!");
          incrementCartCount();
         // navigate("/cart");
        } catch (error) {
          console.error("Error adding product to Firestore:", error);
          setErrorMessage("Failed to add product to the cart.");
        }
      }
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
  // Toggle modal visibility
const handleModalToggle = () => {
  handleDropdownClick()
  setShowModal(!showModal); // Toggle modal visibility
};
const handleSubcategorySelect = (subcategory) => {
  console.log("Selected Subcategory:", subcategory); // Debugging
  setSelectedSubcategory(subcategory);
};


const handleCategoryClick = (category) => {
  setSelectedSubcategory(category);
};
useEffect(() => {
    const fetchProducts = async () => {
      if (selectedSubcategory) {
        try {
          const q = query(
            collection(db, "products"),
            where("category", "==", selectedSubcategory)
          );
          const querySnapshot = await getDocs(q);
          const fetchedProducts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(fetchedProducts);
        } catch (error) {
          console.error("Error fetching products: ", error);
        }
      }
    };
  
    fetchProducts();
  }, [selectedSubcategory]);

  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar onSubcategorySelect={handleSubcategorySelect} />

      <div className="flex-2 w-full lg:w-[1700px] p-2 bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-md">
      {/* <div className="flex space-x-4 mb-6">
        {["Phone", "Laptops", "Tablet", "Accessories"].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-lg ${
              selectedSubcategory === category
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {category}
          </button>
        ))}
      </div> 
      <h2 className="text-2xl font-bold mb-6">All Products</h2> */}
          {selectedSubcategory && (
    <h4 className="text-lg font-medium mb-6">
      Filtered by: <span className="text-primary">{selectedSubcategory}</span>
    </h4>
  )}


        {currentProducts.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative mb-4 group">
                <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-md cursor-pointer group-hover:scale-105 transform transition-all duration-300"
                onClick={() => handleProductClick(product.id)}
              />
                  <FaHeart className="absolute top-4 right-4 text-gray-400 group-hover:text-red-500 cursor-pointer transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {product.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700 dark:text-gray-400">
                    Color:
                  </span>
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: product.color.toLowerCase() }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ₹{product.price}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center space-x-2">
  <button  onClick={() => handleAddToCart(product)}  className="flex items-center justify-center bg-primary text-xs text-white px-2 py-1 rounded shadow-md hover:bg-primary-dark transition">
    <FaShoppingCart className="ml-1 " />
    Add to Cart
  </button>
  <button   onClick={() => handleProductClick(product.id)} className="flex items-center justify-center bg-green-600 text-xs text-white px-2 py-1 rounded shadow-md hover:bg-green-700 transition">
    <FaShoppingBag className="mr-1" />
    Buy Now
  </button>
</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 text-center mt-12">
            No products available for the selected category.
          </p>
        )}
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
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  currentPage === index + 1
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
