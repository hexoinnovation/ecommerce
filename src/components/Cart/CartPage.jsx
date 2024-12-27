import React, { useState, useEffect } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../Authcontext";
import { useNavigate } from "react-router-dom";
import Notiflix from 'notiflix';
import ReactQRCode from 'react-qr-code';
import {
  db,
  doc,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,

} from "../firebase";
import {
  getFirestore,
  onSnapshot ,
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Firebase Auth
import {
  faTrash,
  faArrowRight,
  faHeart,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaCreditCard } from "react-icons/fa"; // Import a payment-related icon
import Swal from 'sweetalert2';
import { useParams } from "react-router-dom";

const CartPage = () => {
  const [step, setStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  //const [totalAmount, setTotalAmount] = useState(0);
  const [billTo, setBillTo] = useState("");
  const [userCartItems, setUserCartItems] = useState([]);
  const [item, setItem] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const { removeFromCart } = useCart();
  const { currentUser } = useAuth();
  const [currentItem,setCurrentItem]=useState("");
  const { id } = useParams();
   const navigate = useNavigate();
  const auth = getAuth(); // Firebase Auth instance
  const steps = [
    { label: "Cart", description: "Review your items" },
    { label: "Details", description: "Enter your details" },
    { label: "Payment", description: "Confirm your order" },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };
  const user = auth.currentUser;
  const saveShippingBillingData = async () => {
    try {
      if (!user || !user.email) {
        console.error("User not authenticated or email not available");
        return;
      }
  
      // Reference to a specific document within the ShippingBilling subcollection
      const userDocRef = doc(db, "users", user.email);
      const cartRef = doc(userDocRef, "ShippingBilling", "latest");
  
      // Data to save or update
      const shippingBillingData = {
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        orderSummary: {
          TotalAmount, // Correctly saving total amount
          shipping,
          tax,
          discount,
        },
        cartItems,
        timestamp: new Date(),
      };
  
      // Create or update the "latest" document
      await setDoc(cartRef, shippingBillingData, { merge: true }); // `merge: true` updates only specified fields
      console.log("Data successfully updated in Firestore");
    } catch (error) {
      console.error("Error saving data to Firestore:", error.message);
      throw error;
    }
  };

  const [orderSummary, setOrderSummary] = useState({});

  const fetchShippingBillingData = async () => {
    try {
      if (!user || !user.email) {
        console.error("User not authenticated or email not available");
        return;
      }
  
      // Reference to the "latest" document in the ShippingBilling subcollection
      const userDocRef = doc(db, "users", user.email);
      const cartRef = doc(userDocRef, "ShippingBilling", "latest");
  
      // Fetch the document data
      const cartSnapshot = await getDoc(cartRef);
  
      if (cartSnapshot.exists()) {
        const data = cartSnapshot.data();
        console.log("Fetched data from Firestore:", data); // Add this log
        return data; // Return the fetched data
      } else {
        console.error("No such document found!");
      }
    } catch (error) {
      console.error("Error fetching data from Firestore:", error.message);
    }
  };

  useEffect(() => {
    const loadShippingBillingData = async () => {
      const data = await fetchShippingBillingData();
      console.log('Fetched data in useEffect:', data);
      if (data) {
        setShippingAddress(data.shippingAddress || {});
        setBillingAddress(data.billingAddress || {});
        setSameAsShipping(data.billingAddress === data.shippingAddress);
        
        setCartItems(data.cartItems || []);
      }
    };
  
    if (user) {
      loadShippingBillingData();
    }
  }, [user]);

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
  const [showModal, setShowModal] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false); // Track wishlist state

  const handleWishlistToggle = async (product) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please login to add products to your wishlist.");
      return;
    }

    try {
      const wishlistRef = doc(
        db,
        "users",
        currentUser.email,
        "Wishlist",
        String(product.id)
      );
      const docSnap = await getDoc(wishlistRef);

      if (docSnap.exists()) {
        // If already in wishlist, remove it
        await deleteDoc(wishlistRef);
        alert("Your product has been removed from your wishlist.");
      } else {
        // Add to wishlist
        await setDoc(wishlistRef, product);
        alert("Your product has been added to your wishlist.");

        // Remove from cart after adding to wishlist
        handleRemoveFromCart(product.id);
      }

      // Update wishlist state
      setIsWishlist(!isWishlist);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };
  const handleRemoveFromCart = async (itemId) => {
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is logged in. Cannot remove item.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.email);
      const cartRef = collection(userDocRef, "AddToCart");
      const itemDocRef = doc(cartRef, String(itemId));

      await deleteDoc(itemDocRef);

      // Update UI by removing the item from the state
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      alert("Your product has been removed from your cart.");
    } catch (error) {
      console.error("Error removing item from Firestore:", error);
    }

    closeModal();
  };
  const openModal = (item) => {
    setCurrentItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentItem(null);
  };
  const handleCheckboxChange = () => {
    setSameAsShipping(!sameAsShipping);
    if (!sameAsShipping) {
      setBillingAddress({ ...shippingAddress });
    }
  };

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    company: "",
    address1: "",
    address2: "",
    country: "",
    zipCode: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    company: "",
    address1: "",
    address2: "",
    country: "",
    zipCode: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(false);

  const handleInputChange = (e, addressType) => {
    const { name, value } = e.target;
    if (addressType === "shipping") {
      setShippingAddress({ ...shippingAddress, [name]: value });
      if (sameAsShipping) {
        setBillingAddress({ ...shippingAddress, [name]: value });
      }
    } else {
      setBillingAddress({ ...billingAddress, [name]: value });
    }
  };

  //  const totalPrice = cartItems.reduce(
  //    (total, item) => total + item.price * item.quantity,
  //    0
  //  );
   const totalAmount = userCartItems.reduce(
     (sum, item) => sum + item.price * item.quantity,
     0
   );
  const shippingCharge = 50;
  
  const [subtotal, setSubtotal] = useState(670); // Initialize with $670.00
 
  const [tax, setTax] = useState(0); // Default to 0
 const[Shipping,setShipping]=useState("");
  const [TotalAmount, setTotal] = useState(subtotal); // Initialize total
  
  // // Update total whenever any value changes
  // const calculateTotal = () => {
  //   const calculatedTotal = subtotal + shipping + tax - discount;
  //   setTotal(calculatedTotal);
  // };
  const [baseAmount, setBaseAmount] = useState(0);
  const [gst, setGst] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const shipping = 100; // Fixed shipping cost

  
  const calculateTotal = () => {
   
    // Calculate Base Amount
    const baseAmountCalc = userCartItems.reduce((acc, item) => {
      return acc + (Number(item.price) || 0);
    }, 0);

    // Calculate GST
    const gstAmount = userCartItems.length > 5 ? 50 : 30;

    // Calculate Discount
    const discountAmount = userCartItems.length < 3 ? 10 : 50;

    // Calculate Final Total
    const finalTotalCalc = totalAmount + shipping + gstAmount - discountAmount;

    // Update States
    setBaseAmount(baseAmountCalc.toFixed(2));
    setGst(gstAmount.toFixed(2));
    setDiscount(discountAmount.toFixed(2));
    setFinalTotal(finalTotalCalc.toFixed(2));
  };

  // Recalculate when cart items change
  useEffect(() => {
    calculateTotal();
  }, [userCartItems]);

  React.useEffect(() => {
    calculateTotal();
  }, [subtotal, shipping, tax, discount]); // Recalculate when these values change

  const [paymentMethod, setPaymentMethod] = useState('');

  const [orderSummaryMessage, setOrderSummaryMessage] = useState(""); // State to hold the order summary message

  const handleShareOrderSummary = async () => {
    try {
        if (!user || !user.email) {
            console.error("User not authenticated or email not available");
            return;
        }

        // Reference to the document in Firestore
        const userDocRef = doc(db, "users", user.email);
        const cartRef = doc(userDocRef, "ShippingBilling", "latest");

        // Fetch the document data
        const cartSnapshot = await getDoc(cartRef);
        if (cartSnapshot.exists()) {
            const data = cartSnapshot.data();

            // Calculate finalTotal
            const shippingCharge = data.orderSummary?.shipping || 0;
            const totalAmount = data.orderSummary?.totalPrice || 0;
            const calculatedFinalTotal = totalAmount + shippingCharge;

            // Update state values
            setShipping(shippingCharge);
            setTax(data.orderSummary?.tax || 0);
            setDiscount(data.orderSummary?.discount || 0);
            setFinalTotal(calculatedFinalTotal); // Correct usage of setFinalTotal

            const shippingAddressString = Object.entries(shippingAddress || {})
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');
                const productDetails = userCartItems
                .map(
                    (item, index) => 
                    `\n*Product ${index + 1}:*\n  Name: ${item.title || item.name}\n  Category: ${item.category || "N/A"}\n  Price: ₹${item.price}\n  Quantity: ${item.quantity}`
                )
                .join("\n");   
            const billingAddressString = sameAsShipping
                ? "Same as shipping address"
                : Object.entries(billingAddress || {})
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');
            
                    console.log("Total Amount:", finalTotal); // Build the order summary message
            const orderSummaryMessage = `
            
*Order Summary*
  Total Items: ${userCartItems.length}
  Amount:₹ ${baseAmount}
  Shipping: ₹${shipping}
  Discount: ₹${(Number(discount) || 0).toFixed(2)}
  Tax: ₹${gst}
  Final Total: ₹${(Number(finalTotal) || 0).toFixed(2)}
  *Products in Cart:*${productDetails}
  
*Shipping Address*
${shippingAddressString}

*Billing Address*
${billingAddressString}

"Thank you for your purchase! We’re thrilled to have your support."
*Confirming your order details... 😊*
`;

            // WhatsApp sharing logic
            const phoneNumber = "+7358937529"; // Replace with target phone number
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderSummaryMessage)}`;
            window.open(url, "_blank");

            // Store order status (optional)
            localStorage.setItem("orderShared", "true");
        } else {
            console.error("No such document found!");
        }
    } catch (error) {
        console.error("Error fetching data from Firestore:", error.message);
    }
};


const [calculatedTotalAmount, setCalculatedTotalAmount] = useState(baseAmount);

useEffect(() => {
  const total = baseAmount + shipping + tax - discount;
  setCalculatedTotalAmount(total > 0 ? total : 0); 
}, [baseAmount, shipping, tax, discount]); 

  useEffect(() => {
      // Check if the order was shared via WhatsApp
      const orderShared = localStorage.getItem("orderShared");
      if (orderShared === "true") {
          Notiflix.Notify.success("Order confirmed! Proceed with payment.");
          // Clear the flag
          localStorage.removeItem("orderShared");
      }
  }, []);
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto p-4 max-w-8xl">
        {/* Stepper */}
        <ol className="relative flex justify-between items-center space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400 ">
          {steps.map((stepData, index) => (
            <li
              key={index}
              className={`flex items-center ${
                index <= step
                  ? "text-green-800 dark:text-green-500"
                  : "text-gray-400"
              }`}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 text-xs border ${
                  index <= step ? "border-green-600" : "border-gray-400"
                } rounded-full`}
              >
                {index + 1}
              </span>
              <span className={`ml-2 ${index <= step ? "font-semibold" : ""}`}>
                {stepData.label}
              </span>
            </li>
          ))}

          {/* Stepper line */}
          <div
            className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-blue-900 transition-all duration-500 ease-in-out"
            style={{
              width: `${(step / (steps.length - 1)) * 100}%`, // Adjust width based on the step
              zIndex: 1, // Ensure the line stays behind the text and icons
              margin: "auto", // Centers the line horizontally
            }}
          ></div>
        </ol>

        {/* Step Content */}
        <div className="mt-7">
        <div className="mt-7">
        {step === 0 && (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
    {/* Cart Items Section */}
    <div className="lg:col-span-3">
      {userCartItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {userCartItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 sm:h-60 object-cover rounded"
                onClick={() => {
                  console.log("Product ID:", item.id);
                  handleProductClick(item.id);
                }}
              />
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mt-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">₹{item.price}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
              <button
                onClick={() => openModal(item)}
                className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                aria-label="Remove from Cart"
              >
                <FontAwesomeIcon icon={faTrash} className="h-5 w-5 mr-2" />
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col text-center space-y-4">
          <img
            src="cart.webp"
            alt="Empty Cart"
            className="w-20 sm:w-32 h-20 sm:h-32 animate-bounce"
          />
          <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 animate-pulse">
            Your Cart is Empty.
          </p>
        </div>
      )}
    </div>

    {/* Order Summary Section */}
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg h-auto lg:h-60">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Order Summary
      </h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Total Items: {userCartItems.length}
      </p>
      <p className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
        Total Amount: ₹{totalAmount.toFixed(2)}
      </p>
      <button
        onClick={handleNext}
        className="w-full sm:w-auto py-3 px-4 bg-black text-white border-2 border-primary rounded-lg transition-transform duration-200 ease-in-out hover:bg-primary hover:text-black hover:border-black hover:shadow-lg active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
        aria-label="Proceed to Checkout"
        disabled={userCartItems.length === 0}
      >
        <span>Proceed to Checkout</span>
        <FontAwesomeIcon icon={faArrowRight} className="h-5 w-5 ml-3" />
      </button>
    </div>
  </div>
)}

</div>
        
        {step === 1 && (
  <div className="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg max-w-6xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Shipping and Billing Section */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          Shipping and Billing Details
        </h3>

        {/* Shipping Address */}
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-300">
            Shipping Address
          </h4>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(shippingAddress).map((field, index) => (
              <input
                key={index}
                type="text"
                name={field}
                placeholder={field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                value={shippingAddress[field]}
                onChange={(e) => handleInputChange(e, "shipping")}
                className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200 w-full"
              />
            ))}
          </form>
        </div>

        {/* Same as Shipping Checkbox */}
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="sameAsShipping"
            checked={sameAsShipping}
            onChange={handleCheckboxChange}
            className="mr-2 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="sameAsShipping"
            className="text-lg text-gray-800 dark:text-gray-300"
          >
            Same as shipping address
          </label>
        </div>

        {/* Billing Address */}
        {!sameAsShipping && (
          <div>
            <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-300">
              Billing Address
            </h4>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(billingAddress).map((field, index) => (
                <input
                  key={index}
                  type="text"
                  name={field}
                  placeholder={field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  value={billingAddress[field]}
                  onChange={(e) => handleInputChange(e, "billing")}
                  className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200 w-full"
                />
              ))}
            </form>
          </div>
        )}
      </div>

      {/* Order Summary Section */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 h-full">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          Order Summary
        </h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Total Items:{" "}
          <span className="font-semibold">{userCartItems.length}</span>
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Base Amount: <span className="font-semibold">₹{totalAmount}</span>
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Shipping: <span className="font-semibold">₹{userCartItems.length === 0 ? 0 : shippingCharge}</span>
        </p>
        <p className="mb-4 text-red-500">
          Discount: <span className="font-semibold">₹{userCartItems.length === 0 ? 0 : -discount}</span>
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          GST (5%): <span className="font-semibold">₹{userCartItems.length === 0 ? 0 : gst}</span>
        </p>

        {/* Final Total */}
        <div className="flex justify-between items-center mt-4 border-t pt-4">
          <label className="font-bold text-lg text-gray-800 dark:text-white">
            Final Total:
          </label>
          <span className="text-xl font-semibold text-gray-800 dark:text-white">
            ₹{userCartItems.length === 0 ? 0 : finalTotal}
          </span>
        </div>

        <button
          onClick={async () => {
            try {
              console.log("Proceed button clicked!");

              // Save shipping and billing data
              await saveShippingBillingData();
              console.log("Shipping and billing data saved successfully!");

              // Move to the next step
              handleNext();
              console.log("Moved to the next step!");
            } catch (error) {
              console.error("Error occurred:", error);
            }
          }}
          className="mt-6 w-full py-2 bg-black text-white rounded-lg border-2 border-primary hover:bg-primary hover:text-black hover:border-black flex items-center justify-center space-x-2"
        >
          <span>Proceed to Checkout</span>
          <FontAwesomeIcon icon={faArrowRight} className="h-5 w-5 ml-3" />
        </button>
      </div>
    </div>
  </div>
)}

{step === 2 && (
  <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Payment Form Section */}
    <div className="flex flex-col justify-start bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6 flex items-center justify-center">
        Payment
        <div className="relative inline-block ml-4">
          <FaCreditCard className="text-[#ff0080] animate-neon text-3xl" />
        </div>
      </h1>

      {/* Payment Methods */}
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Choose a Payment Method
        </h3>

        {/* Cash on Delivery Option */}
        <div className="mb-6 ml-1 sm:ml-10">
          <input
            type="radio"
            id="cash-on-delivery"
            name="paymentMethod"
            value="cash on delivery"
            checked={paymentMethod === "cash on delivery"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <label htmlFor="cash-on-delivery" className="text-gray-800 dark:text-white text-xl">
            Cash on Delivery
          </label>
        </div>

        {/* UPI Option */}
        <div className="flex items-center justify-start sm:justify-center space-x-4 mb-4 sm:mr-80">
          <input
            type="radio"
            id="creditCard"
            name="paymentMethod"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-5 w-5 border-gray-400 hover:border-[#ff0080] focus:ring-[#ff0080] transition "
          />
          <label htmlFor="creditCard" className="text-gray-700 dark:text-gray-300 text-lg">
            UPI
          </label>
        </div>
      </div>
    </div>

    {/* Order Summary Section */}
    {paymentMethod === "cash on delivery" && (
      <div className="flex flex-col justify-start bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Order Summary
        </h3>

        <div className="mb-6 text-gray-700 dark:text-gray-300">
          <p>Total Items: <span className="font-semibold">{userCartItems.length}</span></p>
          <p>Total Amount: <span className="font-semibold">₹{totalAmount}</span></p>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center mb-6">
          <label className="font-semibold text-gray-800 dark:text-gray-300">Shipping:</label>
          <input
            type="number"
            value={userCartItems.length === 0 ? 0 : shippingCharge}
            readOnly
            className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-2 w-24 rounded-lg text-gray-800 dark:text-gray-200"
          />
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center mb-3">
          <label className="font-semibold text-gray-800 dark:text-gray-300">Tax:</label>
          <input
            type="number"
            value={userCartItems.length === 0 ? 0 : gst}
            readOnly
            className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-2 w-24 rounded-lg text-gray-800 dark:text-gray-200"
          />
        </div>

        {/* Discount */}
        <div className="flex justify-between items-center mb-3">
          <label className="font-semibold text-red-500 dark:text-gray-300">Discount:</label>
          <input
            type="number"
            value={userCartItems.length === 0 ? 0 : -discount}
            readOnly
            className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-2 w-24 rounded-lg text-red-500 dark:text-gray-200"
          />
        </div>

        {/* Final Total */}
        <div className="flex justify-between items-center mt-1 border-t pt-6">
          <label className="font-bold text-lg text-gray-800 dark:text-white">Final Total:</label>
          <span className="text-xl font-semibold text-gray-800 dark:text-white">
            ₹{userCartItems.length === 0 ? 0 : finalTotal}
          </span>
        </div>

        <div className="mt-6">
  <button
    onClick={async () => {
      try {
        // Display SweetAlert modal for order confirmation and WhatsApp sharing
        const response = await Swal.fire({
          title: 'Order Confirmed!',
          text: 'Your order has been successfully placed. ',
          text:'Do you want to share your order on WhatsApp?',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Yes, Share',
          cancelButtonText: 'No, Thank You',
        });

        if (response.isConfirmed) {
          // Trigger WhatsApp sharing
          await handleShareOrderSummary();
          await Swal.fire({
            title: 'Order Shared!',
            text: 'Your order details have been shared on WhatsApp.',
            icon: 'success',
            confirmButtonText: 'Okay',
          });
        } else {
          // Display Thank You message if No is clicked
          await Swal.fire({
            title: 'Thank You!',
            text: 'Thank you for shopping with us',
            text: 'We hope to see you again soon!.',
            icon: 'info',
            confirmButtonText: 'Close',
          });
        }
      } catch (error) {
        console.error('Error during confirmation:', error.message);
        // Display SweetAlert error message
        await Swal.fire({
          title: 'Error!',
          text: 'Something went wrong while confirming your order.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    }}
    className="bg-gradient-to-r from-black to-green-800 mt-2 ml-10 sm:ml-0 sm:mx-auto  hover:from-green-500 hover:to-green-700 text-white px-8 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 block sm:inline"
>
  Confirm and Pay
  </button>
</div>
              </div>
            )}
            {paymentMethod === "upi" && (
  <div className="mt-6">
    <div className="space-y-4 text-gray-700 dark:text-gray-300">
  <p className="text-lg">Sub Total: <span className="font-semibold">₹{totalAmount}</span></p>

  <div className="flex justify-between items-center text-lg">
    <span className="font-medium">Shipping Charge:</span>
    <span className="text-gray-700 dark:text-gray-300">₹{userCartItems.length === 0 ? 0 : shippingCharge}</span>
  </div>

  <div className="flex justify-between items-center text-lg">
    <span className="font-medium">GST (5%):</span>
    <span className="text-gray-700 dark:text-gray-300">₹{userCartItems.length === 0 ? 0 : gst}</span>
  </div>

  <div className="flex justify-between items-center text-lg text-red-600 font-semibold">
    <span className="font-medium">Discount:</span>
    <span>-  {userCartItems.length === 0 ? 0 : -discount}</span>
  </div>
</div>

{/* Total */}
<div className="flex justify-between items-center mt-6 border-t pt-4">
  <span className="font-bold text-lg text-gray-800 dark:text-white">
    Total:
  </span>
  <span className="text-2xl font-semibold text-green-600 dark:text-green-400">
    ₹{finalTotal}
  </span>
</div>
<div className="mt-6">
    <h3 className="text-xl font-semibold">Scan this UPI QR Code to Pay</h3>
    <ReactQRCode 
      value={`upi://pay?pa=madhumithamadhumitha003@oksbi&pn=MATHUMITHA%20G&mc=&tid=12345&tr=123456&tn=PaymentforOrder&am=${finalTotal}&cu=INR`} // UPI URL with parameters
      size={256}
      className="mt-4 mx-auto"
    />
    <p className="text-lg text-center mt-4">Use your UPI app to scan the QR code and make the payment.</p>
  </div>
  </div>
)}
                  </div>
                  
          )}
          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              disabled={step === 0}
            >
              Back
            </button>
            {(step === 0 || step === 0) && (
  <button
    onClick={handleNext}
    className="bg-primary border-2 border-black text-black px-4 py-2 rounded-md"
  >
    Next
  </button>
)}
          </div>
        </div>
      </div>
    </div>
    
    
  );
}
export default CartPage;