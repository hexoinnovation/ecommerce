import React, { useEffect, useRef, useState } from "react";
import {
  MoonIcon,
  SunIcon,
  ShoppingCartIcon,
  UserIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  CogIcon,
  LogoutIcon,
} from "@heroicons/react/solid"; // Importing icons from Heroicons
import { FaUser, FaLock, FaSignInAlt, FaTimes } from "react-icons/fa"; // Importing icons
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,query,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../firebase"; // Your firebase configuration
import { Link, useNavigate,useLocation } from "react-router-dom";
import { HomeIcon, PhoneIcon } from "@heroicons/react/outline";
import { useAuth } from "../Authcontext";
import CartPage from "../Cart/CartPage";
import CartDrawer from "../Navbar/CartDrawer";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";




const Navbar = () => {
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null); // For mobile dropdown toggle
  const [dropdownOpen, setDropdownOpen] = useState(false); // For login dropdown
  const [isDarkMode, setIsDarkMode] = useState(false); // For dark mode toggle
  const [sidebarOpen, setSidebarOpen] = useState(false); // For sidebar visibility
  //const { cartCount, incrementCartCount, decrementCartCount } = useAuth(); // Access cart count and functions
  const { cartCount } = useAuth(); // Access cartCount from context
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [error, setError] = useState(""); // Add state for error message
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const dropdownRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  //const { category } = useParams();
// const [category, setcategory] = useState("");
  // Toggle category dropdown visibility for mobile view
  const toggleCategoryDropdown = (index) => {
    if (openCategoryIndex === index) {
      setOpenCategoryIndex(null); // Close dropdown if it's already open
    } else {
      setOpenCategoryIndex(index); // Open the selected category dropdown
    }
  };

  // Toggle login dropdown
  const toggleLoginDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Toggle sidebar visibility for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle theme between dark and light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  const [showModal, setShowModal] = useState(false); // Initially set to false

  // Toggle modal visibility
  const handleModalToggle = () => {
    handleDropdownClick();
    setShowModal(!showModal); // Toggle modal visibility
  };
  // Close modal
  const closeModal = () => {
    setShowModal(false); // Close the modal by setting showModal to false
  };

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const location = useLocation();
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const category = query.get("category"); // Extract 'category' from URL
 
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const storedUsername = localStorage.getItem("username");

    if (authStatus === "true") {
      setIsAuthenticated(true);
      setUsername(storedUsername); // Load the username from localStorage
    }
  }, []);

  const handleSignup = async () => {
    setError("");
    setSuccessMessage("");

    if (!email || !password || !username) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save the username in Firestore during signup
      const userDocRef = doc(db, "users", email);
      await setDoc(userDocRef, {
        email: user.email,
        password:password,
        username: username, // Set the provided username
        createdAt: new Date(),
        lastLogin: new Date(),
      });

      setSuccessMessage("Account created successfully! Please log in.");
      setIsSignup(false); // Switch to login form
    } catch (error) {
      console.error("Signup Error: ", error); // Log error
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  const handleLogin = async () => {
    setError(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Log in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if the user document exists in Firestore
      const userDocRef = doc(db, "users", user.email); // Use user.email as the ID
      const userDocSnap = await getDoc(userDocRef);

      let fetchedUsername = ""; // Default to empty string

      if (userDocSnap.exists()) {
        // If user document exists, get the username from Firestore
        const userData = userDocSnap.data();
        fetchedUsername = userData.username || "Default Username"; // Fallback to 'Default Username'
      } else {
        // If no user document exists, create one with a default username
        fetchedUsername = "Default Username"; // Default username for new users
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

      setSuccessMessage("Login successful!");
      setShowModal(false); // Close modal after login

      // Store authentication state and username in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", fetchedUsername);
      localStorage.setItem("userEmail", user.email); // Optionally store email as well
    } catch (error) {
      console.error("Login Error: ", error);
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  // Close the login dropdown when clicking any menu item
  const handleDropdownClick = () => {
    setDropdownOpen(false); // Close the login dropdown
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown if click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const navigate = useNavigate();
  const handleAccountClick = () => {
    navigate("/account"); // Navigate to the account page when "My Account" is clicked
  };
  const handleMyOrdersClick = () => {
    navigate("/myorders"); // Navigate to the account page when "My Account" is clicked
  };

  const { logout, resetUserData } = useAuth();

  const handleLogout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
  
    if (isConfirmed) {
      await logout(); 
      resetUserData(); 
      alert("Logout successful! Please login to access your details.");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("username");
      localStorage.removeItem("userEmail");
      setIsAuthenticated(false); 
      setDropdownOpen(false); 
      window.location.reload(); 
    }
  };
  
  const handleHomeClick = () => {
    navigate("/");
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen); 
  };
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);  

  // Function to open the cart drawer
  const toggleCartDrawer = () => {
    setCartDrawerOpen(!isCartDrawerOpen);
  };
  const [isSticky, setIsSticky] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [openDropdown, setOpenDropdown] = useState(null); 

  const handleDropdownToggle = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(null); 
    } else {
      setOpenDropdown(index); 
    }
  };
  const [wishlistItems, setWishlistItems] = useState([]);
  const { currentUser } = useAuth(); // Access currentUser from AuthContext
  const fetchWishlist = async () => {
    try {
      const wishlistRef = collection(
        db,
        "users",
        currentUser.email,
        "Wishlist"
      );
      const querySnapshot = await getDocs(wishlistRef);

      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Firestore document ID
        ...doc.data(), // Other item data
      }));

      setWishlistItems(items); // Update state with the fetched items
      navigate("/wishlist", { state: { items } });
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // const [selectedCategory, setSelectedCategory] = useState(null);

// // Function to handle dropdown option clicks
// const handleCategorySelect = (category) => {
//   setSelectedCategory(category); // Store the selected category
//   console.log("Selected category:", category);
// };

// useEffect(() => {
//   if (selectedCategory) {
//     fetchCategoryProducts();
//   }
// }, [selectedCategory]);
// useEffect(() => {
//   const params = new URLSearchParams(location.search);
//   const categoryFromURL = params.get("category");
//   if (categoryFromURL) {
//     setCategory(categoryFromURL);
//   }
// }, [location]);


// Handle category selection
const handleCategorySelect = (category) => {
  setSelectedCategory(category); // Update the selected category
  navigate(`/products?category=${category}`); // Navigate to the updated route
};



  return (
    <div>
      <div>
        {/* Upper Navbar */}
        <nav
          className={`bg-black text-white dark:bg-white dark:text-black shadow-md fixed w-full z-50 transition-all duration-300 ease-in-out ${
            isSticky ? "top-0" : "top-0"
          }`}
        >
          <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2">
            {/* Left Side (Toggle Menu and Logo) */}
            <div className="flex items-center space-x-3">
              {/* Mobile toggle button */}
              <button
                className="lg:hidden text-white dark:text-white"
                onClick={toggleSidebar}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Logo */}
              <div className="flex items-center space-x-2">
              <span className="flex items-center text-2xl font-bold text-black dark:text-white">
  <img
    src="logo.png" 
    alt="Hexo Logo"
    className="h-14 w-18 mr-2 mt-1" // Increased height and width
  />
</span>
              </div>
            </div>

            {/* Desktop View - Search Bar and Icons */}
            <div className="hidden lg:flex items-center space-x-4 w-full justify-center  ">
              <div className="flex items-center space-x-2 flex-grow max-w-3xl ">
                <input
                  type="text"
                  className="w-half py-2 px-4 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Search for products, brands, and more"
                />
                <button className="bg-primary text-black px-4 py-2 rounded-r-md hover:bg-primary hover:text-white dark:text-black dark:bg-white dark:hover:bg-primary/40 dark:hover:text-white">
                  Search
                </button>

                <button
  onClick={handleHomeClick}
  className="w-full sm:w-auto hover:bg-yellow-500  px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2 transition duration-300 ease-in-out  "
>
  <HomeIcon className="h-5 w-5 text-white" /> {/* White Home Icon */}
  <span>Home</span>
</button>

                <Link to={"/view-all"}>
                  <button className="w-full sm:w-auto hover:bg-yellow-500  px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2 transition duration-300 ease-in-out ml-6">
                    {" "}
                    {/* ml-3 for slight right margin */}
                    <ShoppingCartIcon className="h-5 w-5 text-white " />{" "}
                    {/* Shop Icon */}
                    <span>Shop</span>
                  </button>
                </Link>

                {/* <button
  className="w-full sm:w-auto hover:bg-yellow-500 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2 transition duration-300 ease-in-out whitespace-nowrap"
>
  <PhoneIcon className="h-5 w-5 text-white" /> 
  <span>Contact Us</span>
</button> */}

              </div>
            </div>

            {/* Right Side (Login, Cart, Theme Toggle, Admin Icon) */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  className="text-white dark:text-white font-semibold flex items-center space-x-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown on click
                >
                  {isAuthenticated ? (
                    <span>{username}</span> // Display the username if logged in
                  ) : (
                    <span>Login</span> // Display "Login" if not authenticated
                  )}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown when authenticated */}
                {dropdownOpen && isAuthenticated && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-md py-2"
                  >
                    <button
                      onClick={handleAccountClick}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <UserCircleIcon className="w-5 h-5 mr-2" />
                      My Account
                    </button>
                    <button
                      onClick={handleMyOrdersClick}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ShoppingBagIcon className="w-5 h-5 mr-2" />
                      My Orders
                    </button>
                    <button
                      onClick={fetchWishlist}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ShoppingCartIcon className="w-5 h-5 mr-2" />
                      My Wishlist
                    </button>
                    {/* <button className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <CogIcon className="w-5 h-5 mr-2" />
                      Settings
                    </button> */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogoutIcon className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </div>
                )}

                {/* Dropdown when not authenticated */}
                {dropdownOpen && !isAuthenticated && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-md py-2"
                  >
                    <button
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleModalToggle}
                    >
                      <UserCircleIcon className="w-5 h-5 mr-2" />
                      Login
                    </button>
                    <button
                      onClick={handleAccountClick}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <UserCircleIcon className="w-5 h-5 mr-2" />
                      My Account
                    </button>
                    <button
                      onClick={handleMyOrdersClick}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ShoppingBagIcon className="w-5 h-5 mr-2" />
                      My Orders
                    </button>
                    <button
                      onClick={fetchWishlist}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ShoppingCartIcon className="w-5 h-5 mr-2" />
                      My Wishlist
                    </button>
                    {/* <button className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <CogIcon className="w-5 h-5 mr-2" />
                      Settings
                    </button> */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogoutIcon className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
              <button
  className="relative text-white dark:text-white"
  onClick={toggleCartDrawer}
>
  <ShoppingCartIcon className="w-6 h-6" />
  {cartCount > 0 && (
    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {cartCount}
    </span>
  )}
</button>

              {/* Drawer for Cart */}
              {/* Cart Drawer */}
              <CartDrawer
                isOpen={isCartDrawerOpen}
                closeDrawer={toggleCartDrawer} // Function to close the drawer when clicked outside or when user clicks the close button
              />
              {/* Admin Icon (replaced with User Icon for now) */}
              {/* <button className="text-black dark:text-white">
                <UserIcon className="w-6 h-6" />
              </button> */}

              {/* Theme Toggle Button */}
              {/* <button
                onClick={toggleTheme}
                className="text-white dark:text-white"
              >
                {isDarkMode ? (
                  <SunIcon className="w-6 h-6" />
                ) : (
                  <MoonIcon className="w-6 h-6" />
                )}
              </button> */}
            </div>
          </div>
        </nav>
        {/* Sidebar Menu (Mobile View - Toggle Menu) */}
        <div
          className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transform ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300`}
        >
          <div className="w-64 bg-white dark:bg-gray-800 p-4 h-full">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-4">
            <span className="flex items-center text-2xl font-bold text-black dark:text-white">
  <img
    src="logo.png" 
    alt="Hexo Logo"
    className="h-8 w-8 mr-2" // Adjust height, width, and spacing
  />
</span>
              <button
                onClick={toggleSidebar}
                className="text-black dark:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:space-x-2">
              <input
                type="text"
                className="w-full py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white"
                placeholder="Search for products, brands, and more"
              />
              <button className="bg-primary/40 text-black px-4 py-2 rounded-md hover:bg-primary hover:text-white dark:text-black dark:bg-white dark:hover:bg-primary/100 dark:hover:text-white">
                Search
              </button>
       <button
  onClick={handleHomeClick}
  className="w-full sm:w-auto hover:bg-yellow-600 bg-yellow-500 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2 transition duration-300 ease-in-out"
>
  <HomeIcon className="h-5 w-5 text-white" /> {/* White Home Icon */}
  <span>Home</span>
</button>

              <Link to={"/view-all"}>
                <button className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2">
                  <ShoppingCartIcon className="h-5 w-5 text-black dark:text-white" />{" "}
                  {/* Shop Icon */}
                  <span>Shop</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Lower Navbar (Desktop View - Category Links) */}
        <div className="bg-white text-black shadow-sm lg:block hidden mt-16 dark:bg-gray-800 dark:text-white ">
          <div className="max-w-screen-xl mx-auto py-1 px-4 ">
            <div className="flex justify-center space-x-6 py-2 ">
              {/* Electronics Dropdown */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle(0)}
                  className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2"
                >
                  <span>Electronics</span>
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </button>
                {openDropdown === 0 && (
                  <div
                    className="absolute left-0 top-full bg-white shadow-lg mt-1 py-2 px-6 w-auto rounded-md z-10 transition-all duration-300 hover:scale-105"
                    onMouseLeave={() => handleDropdownToggle(null)}
                  >
                <Link
  to={`/products?category=Phone`}
  onClick={() => handleCategorySelect("Phone")}
  className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
>
  Phones
</Link>

<Link
  to={`/products?category=Laptops`}
  onClick={() => handleCategorySelect("Laptops")}
  className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
>
  Laptops
</Link>
                    <Link
                    to={`/products?category=Accessories`}

                      onClick={() => handleCategorySelect("Accessories")}
                      className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      Accessories
                    </Link>
                  </div>
                )}
                 
              </div>

              {/* Fashion Dropdown */}
              <div className="relative">
                {/* Fashion Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => handleDropdownToggle(1)}
                    className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2"
                  >
                    <span>Fashion</span>
                    <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                  </button>
                  {openDropdown === 1 && (
                    <div
                      className="absolute left-0 top-full bg-white shadow-lg mt-1 py-2 px-6 w-auto rounded-md z-10 transition-all duration-300 hover:scale-105"
                      onMouseLeave={() => handleDropdownToggle(null)}
                    >
                      <Link
                        to="/Fashion/Mens"to={`/products?category=Mens`}
                        onClick={() => handleCategorySelect("Mens")}
                        className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                      >
                        Mens
                      </Link>
                      <Link
                        to="/Fashion/Womens"
                        className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                      >
                        Womens
                      </Link>
                      <Link
                        to="/Fashion/Kids"
                        className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                      >
                        Kids
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Toys Dropdown */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle(2)}
                  className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2"
                >
                  <span>Toys</span>
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </button>
                {openDropdown === 2 && (
                  <div
                    className="absolute left-0 top-full bg-white shadow-lg mt-1 py-2 px-6 w-[190px] rounded-md z-10 transition-all duration-300 hover:scale-105"
                    onMouseLeave={() => handleDropdownToggle(null)}
                  >
                    <Link
                      to="/toys/action-figures"
                      className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      Action Figures
                    </Link>
                    <Link
                      to="/toys/board-games"
                      className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      Board Games
                    </Link>
                  </div>
                )}
              </div>

              {/* Jewelry Dropdown */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle(3)}
                  className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2"
                >
                  <span>Jewelry</span>
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </button>
                {openDropdown === 3 && (
                  <div
                    className="absolute left-0 top-full bg-white shadow-lg mt-1 py-2 px-6 w-[150px] rounded-md z-10 transition-all duration-300 hover:scale-105"
                    onMouseLeave={() => handleDropdownToggle(null)}
                  >
                    <Link
                      to="/jewelry/rings"
                      className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      Rings
                    </Link>
                    <Link
                      to="/jewelry/necklaces"
                      className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      Necklaces
                    </Link>
                  </div>
                )}
              </div>

              {/* Decoration Dropdown */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle(4)}
                  className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2"
                >
                  <span>Decoration</span>
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </button>
                {openDropdown === 4 && (
                  <div
                    className="absolute left-0 top-full bg-white shadow-lg mt-1 py-2 px-6 w-[150px] rounded-md z-10 transition-all duration-300 hover:scale-105"
                    onMouseLeave={() => handleDropdownToggle(null)}
                  >
                    <Link
                      to="/decoration/furniture"
                      className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      Furniture
                    </Link>
                    <Link
                      to="/decoration/lighting"
                      className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      Lighting
                    </Link>
                  </div>
                )}
              </div>

              {/* Sports Dropdown */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle(5)}
                  className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2"
                >
                  <span>Sports</span>
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </button>
                {openDropdown === 5 && (
                  <div
                    className="absolute left-0 top-full bg-white shadow-lg mt-1 py-2 px-6 w-[150px] rounded-md z-10 transition-all duration-300 hover:scale-105"
                    onMouseLeave={() => handleDropdownToggle(null)}
                  >
                    <Link
                      to="/sports/outdoor"
                      className="w-full  sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      Outdoor
                    </Link>
                    <Link
                      to="/sports/fitness"
                      className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      Fitness
                    </Link>
                  </div>
                )}
              </div>

              {/* Gift Dropdown */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle(6)}
                  className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2"
                >
                  <span>Gift</span>
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </button>
                {openDropdown === 6 && (
                  <div
                    className="absolute left-0 top-full bg-white shadow-lg mt-1 py-2 px-6 w-[150px] rounded-md z-10 transition-all duration-300 hover:scale-105"
                    onMouseLeave={() => handleDropdownToggle(null)}
                  >
                    <Link
                      to="/gift/for-her"
                      className="w-full  sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      For Her
                    </Link>
                    <Link
                      to="/gift/for-him"
                      className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      For Him
                    </Link>
                  </div>
                )}
              </div>

              {/* Books Dropdown */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle(7)}
                  className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2"
                >
                  <span>Books</span>
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                </button>

                {openDropdown === 7 && (
                  <div
                    className="absolute left-0 top-full bg-white shadow-lg mt-1 py-2 px-6 w-[170px] rounded-md z-10 transition-all duration-300 hover:scale-105"
                    onMouseLeave={() => handleDropdownToggle(null)}
                  >
                    <Link
                      to="/books/fiction"
                      className="w-full  sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      Fiction
                    </Link>
                    <Link
                      to="/books/non-fiction"
                      className="w-full sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-base flex items-center space-x-2"
                    >
                      Non-Fiction
                    </Link>
                  </div>
                )}
              
              </div>
              
            </div>
            
          </div>
            {/* Displaying Products for the Selected Category */}
    
        </div>

        {showModal &&
          !isAuthenticated && ( // Only show modal when showModal is true and user is not authenticated
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white p-10 rounded-lg w-96 shadow-lg relative">
                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>

                <h2 className="text-3xl mb-6 text-center font-bold text-gray-800 font-serif">
                  {isSignup ? "Sign Up" : " Login"}
                </h2>

                {/* Display Success or Error Message */}
                {successMessage && (
                  <p className="text-green-500 text-center">{successMessage}</p>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {/* Login or Signup Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    isSignup ? handleSignup() : handleLogin();
                  }}
                >
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
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-600 text-white p-3 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <FaSignInAlt />
                    <span>{isSignup ? "Sign Up" : "Login"}</span>
                  </button>
                </form>
                {/* Switch to Sign Up / Login */}
                <p className="text-sm mt-4 text-center text-gray-600">
                  {isSignup ? (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => setIsSignup(false)}
                        className="text-blue-500 hover:underline"
                      >
                        Login
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <button
                        onClick={() => setIsSignup(true)}
                        className="text-blue-500 hover:underline"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Navbar;
