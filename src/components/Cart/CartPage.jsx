import React, { useState, useEffect } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../Authcontext";
import { useNavigate } from "react-router-dom";
import Notiflix from 'notiflix';

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
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Stepper */}
        <ol className="relative flex justify-between items-center space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400">
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                  className="h-60 object-cover rounded" onClick={() => {
                    console.log("Product ID:", item.id);
                    handleProductClick(item.id);
                  }}
                />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {item.title}
                </h3>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <h3 className="text-lg font-semibold">{item.category}</h3>
                <p className="text-gray-600 dark:text-gray-400">₹{item.price}</p>
                <p className="text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                <button
                      onClick={() => openModal(item)}
                      className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                      aria-label="Remove from Cart"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-5 w-5 mr-2" />
                      Remove
                    </button>

                    {/* Modal */}
                    {showModal && currentItem.id === item.id && (
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
                          {/* Close Button */}
                          <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            aria-label="Close Modal"
                          >
                            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                          </button>

                          <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
                          <p className="mb-4">
                            Do you want to remove this item or add it to your wishlist?
                          </p>

                          <div className="flex justify-between">
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                              aria-label="Remove from Cart"
                            >
                              <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                            </button>

                            <button
                              onClick={() => handleWishlistToggle(item)}
                              className={`py-2 px-4 text-white rounded flex items-center ${isWishlist ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"}`}
                            >
                              <FontAwesomeIcon icon={faHeart} className={`mr-2 ${isWishlist ? "text-red-500" : "text-white"}`} />
                              {isWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                            </button>
                          </div>

                          <div className="mt-4 flex justify-end"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center flex-col text-center space-y-4">
                <img
                  src="cart.webp" // Replace with your own empty state image or icon
                  alt="Empty Cart"
                  className="w-32 h-32 animate-bounce"
                />
                <p className="text-gray-700 dark:text-gray-300 text-xl animate-pulse">
                  Your Cart is Empty.
                </p>
              </div>
            )}
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg h-60">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Order Summary</h2>
    <p className="text-gray-700 dark:text-gray-300">Total Items: {userCartItems.length}</p>
    <p className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Total Amount: ₹{totalAmount.toFixed(2)}</p>
    <button
  onClick={handleNext}
  className="inline-flex items-center justify-center py-3 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg transition-transform duration-200 ease-in-out hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
  aria-label="Proceed to Checkout"
  disabled={userCartItems.length === 0}
>
  <span>Proceed to Checkout</span>
  <FontAwesomeIcon icon={faArrowRight} className="h-5 w-5 ml-2" />
</button>

  </div>
    </div>
  )}
</div>
        
          {step === 1 && (
            <div className="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg max-w-7xl mx-auto">
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
                          className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200"
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
                            className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200"
                          />
                        ))}
                      </form>
                    </div>
                  )}
                </div>

              {/* Order Summary Section */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 h-3/4">
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

      {/* Shipping */}
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Shipping: <span className="font-semibold">₹{userCartItems.length === 0 ? 0: shippingCharge}</span>
      </p>

      {/* Discount */}
      <p className="mb-4 text-red-500">
        Discount: <span className="font-semibold">₹  {userCartItems.length === 0 ? 0: -discount}</span>
      </p>

      {/* GST */}
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        GST (5%): <span className="font-semibold">  ₹{userCartItems.length === 0 ? 0: gst}</span>
      </p>

    {/* Final Total */}
<div className="flex justify-between items-center mt-4 border-t pt-4">
  <label className="font-bold text-lg text-gray-800 dark:text-white">
    Final Total:
  </label>
  <span className="text-xl font-semibold text-gray-800 dark:text-white">
    ₹{userCartItems.length === 0 ? 0: finalTotal}
  </span>
</div>



      {/* Proceed Button */}
      <button
        onClick={() => {
          // Save and proceed
          saveShippingBillingData();
          handleNext();
        }}
        className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center space-x-2"
        disabled={cartItems.length === 0}
      >
        <span>Proceed to Checkout</span>
        <FontAwesomeIcon icon={faArrowRight} className="h-5 w-5" />
      </button>
      </div>
              </div>
            </div>
          )}

          {step === 2 && (
             <div>
            <div className="p-6 bg-gray-100 rounded-lg max-w-6xl ml-40 mr-40 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Form Code */}
                <div>
                    <h1 className="text-2xl font-bold ml-20 t-4p-4 text-center rounded-lg flex items-center space-x-4">
                        <span>Payment</span>
                        <div className="relative">
                            <FaCreditCard className="text-[#ff0080] animate-neon" />
                        </div>
                    </h1>

          {/* Payment Methods */}
          <div className="mt-6 ml-0">
            <h3 className="text-xl font-semibold ml-20 mb-4">
              Choose a Payment Method
            </h3>

            {/* Cash on Delivery Option */}
            <div className="mb-4 ml-20">
              <input
                type="radio"
                id="cash-on-delivery"
                name="paymentMethod"
                value="cash on delivery"
                checked={paymentMethod === "cash on delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="cash-on-delivery" className="ml-2">
                Cash on Delivery
              </label>
            </div>

            {/* Credit Card Option */}
            <div className="mb-4 ml-20">
              <input
                type="radio"
                id="creditCard"
                name="paymentMethod"
                value="creditCard"
                checked={paymentMethod === "creditCard"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="creditCard" className="ml-2">
                Credit Card
              </label>
            </div>

            {/* Order Summary Section (shown when Cash on Delivery is selected) */}
            {paymentMethod === "cash on delivery" && (
              <div className="mt-6 ml-20">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Order Summary
                </h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
    Total Items:{" "}
    <span className="font-semibold">{userCartItems.length}</span>
  </p>
  <p className="mb-4 text-gray-700 dark:text-gray-300">
    Total Amount:{" "}
    <span className="font-semibold">₹{totalAmount}</span>
  </p>

               {/* Shipping */}
<div className="flex justify-between items-center mb-4">
  <label className="font-semibold text-gray-800 dark:text-gray-300">
    Shipping:
  </label>
  <input
    type="number"
    value={userCartItems.length === 0 ? 0: shippingCharge}
    readOnly
    className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-2 w-24 rounded-lg text-gray-800 dark:text-gray-200"
  />
</div>

{/* Tax */}
<div className="flex justify-between items-center mb-4">
  <label className="font-semibold text-gray-800 dark:text-gray-300">
    Tax:
  </label>
  <input
    type="number"
    value=  {userCartItems.length === 0 ? 0: gst}
    readOnly
    className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-2 w-24 rounded-lg text-gray-800 dark:text-gray-200"
  />
</div>

{/* Discount */}
<div className="flex justify-between items-center mb-4">
  <label className="font-semibold text-red-500 dark:text-gray-300">
    Discount:
  </label>
  <input
    type="number"
    value=  {userCartItems.length === 0 ? 0:-discount}
    readOnly
    className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-2 w-24 rounded-lg text-red-500 dark:text-gray-200"
  />
</div>

               {/* Total */}
  <div className="flex justify-between items-center mt-4 border-t pt-4">
    <label className="font-bold text-lg text-gray-800 dark:text-white">
      Final Total:
    </label>
    <span className="text-xl font-semibold text-gray-800 dark:text-white">
    ₹{userCartItems.length === 0 ? 0: finalTotal}
    </span>
  </div>
              </div>
            )}

            {/* Confirmation Button */}
            <div className="mt-6">
            <button 
  onClick={async () => {
    try {
      // Display SweetAlert confirmation
      await Swal.fire({
        title: 'Order Confirmed!',
        text: 'Your order has been successfully placed.',
        icon: 'success',
        confirmButtonText: 'Continue to Payment',
      });

      // Save order details to Firestore
      const orderDetails = {
        cartItems: userCartItems,
        shippingAddress: shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        totalItems: userCartItems.length,
        baseAmount: totalAmount,
        shipping: userCartItems.length === 0 ? 0 : shippingCharge,
        discount: userCartItems.length === 0 ? 0 : discount,
        gstAmount: Math.round(gst?.gst ?? 0),
        finalTotal: Math.round(finalTotal?.finalTotal ?? 0),
        orderDate: new Date().toISOString(), // Timestamp for the order
        paymentMethod: paymentMethod, // Add payment method here
      };

      // Get the user's document reference in Firestore
      const userDocRef = doc(db, "users", user.email);
      const cartRef = collection(userDocRef, "Cart order");

      // Save the order details in Firestore
      await setDoc(doc(cartRef, `order-${new Date().getTime()}`), orderDetails);

      // Share order summary via WhatsApp
      await handleShareOrderSummary();
    } catch (error) {
      console.error("Error during confirmation:", error.message);
      // Display SweetAlert error message
      await Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while confirming your order.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  }}
  className="bg-green-600 text-white px-6 py-2 rounded-md w-full sm:w-auto ml-20"
>
  Confirm and Pay
</button>

            </div>
                  </div>
                </div>
              </div>
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
            <button
              onClick={handleNext}
              className="bg-primary/100 text-white px-4 py-2 rounded-md"
              disabled={step === steps.length - 1}
            >
              {step === steps.length - 1 ? "Complete" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
    
  );
}
export default CartPage;