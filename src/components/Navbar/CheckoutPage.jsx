import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../Authcontext"; // Access currentUser
import { useNavigate,useLocation } from "react-router-dom";
import { db, doc, collection, setDoc, deleteDoc, getDoc,  } from "../firebase"; // Firestore methods
import Navbar from "./Navbar";
import Footer from "../Footer/Footer";
import { FaCreditCard } from "react-icons/fa"; // Import a payment-related icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth"; // Firebase Aut
import Swal from 'sweetalert2';

const CartPage = () => {
  const [step, setStep] = useState(0);
  const location = useLocation();
  const product = location.state?.product;
  

  const [checkoutDetails, setCheckoutDetails] = useState({
    price: product?.price || 0,
    quantity: product?.quantity || 1,
    gstRate: 0.18, // 18% GST
    discount: 100, // Default discount
    shippingCharge: 50, // Default shipping charge
  });
  const [cartItems, setCartItems,removeFromCart] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth(); // Firebase Auth instance
  const[gstAmount,setgst]=useState();
  const [currentUser, setCurrentUser] = useState();
  const calculateTotal = () => {
    const { price, quantity, shippingCharge,  } = checkoutDetails;
  
    // Calculate subtotal
    const subtotal = price * quantity;
  
   
    const gstRate = 0.05; // 5% GST
    const gstAmount = subtotal * gstRate;
  
    // Calculate Discount
    let discount = 0;
    if (subtotal > 1000) {
      discount = 100; // Rs. 100 discount for subtotal > 1000
    } else if (subtotal >= 500 && subtotal <= 1000) {
      discount = 50; // Rs. 50 discount for subtotal in range 500-1000
    } else if (subtotal < 500) {
      discount = 10; // Rs. 10 discount for subtotal < 500
    }
  
    // Calculate total amount
    const total = subtotal + gstAmount - discount + shippingCharge;
  
    return {
      subtotal,
      gstAmount,
      discount,
      total,
    };
  };
  
  const totals = calculateTotal();
  
  const steps = [
    { label: "Details", description: "Enter your details" },
    { label: "Payment", description: "Confirm your order" },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Calculate the total price and final total
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingCharge = 50;
  const finalTotal = totalPrice + shippingCharge;
  
  // Firestore reference for the user's cart subcollection
  const userCartRef = currentUser
    ? collection(doc(db, "users", currentUser.email), "cart")
    : null;

  // Fetch the current user's details
  useEffect(() => {
    const fetchUser = () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetchShippingBillingData();
  }, []);

  const fetchShippingBillingData = async () => {
    try {
      const user = auth.currentUser;
  
      if (!user || !user.email) {
        console.error("User not authenticated or email not available");
        return;
      }
  
      // Reference to the 'latest' document in the 'ShippingBilling' subcollection
      const cartRef = doc(db, "users", user.email, "ShippingBilling", "latest");
  
      // Fetch the document
      const docSnap = await getDoc(cartRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Fetched ShippingBilling Data:", data);
  
        // Do something with the data, like setting it in state
        setShippingAddress(data.shippingAddress || {});
        setBillingAddress(data.billingAddress || {});
        setCartItems(data.cartItems || []);
        console.log("Order Summary:", data.orderSummary);
      } else {
        console.log("No data found in the ShippingBilling collection.");
      }
    } catch (error) {
      console.error("Error fetching ShippingBilling data:", error.message);
    }
  };

  // // Save cart items on change
  // useEffect(() => {
  //   const saveCartItems = async () => {
  //     if (currentUser) {
  //       const userCartRef = collection(db, "users", currentUser.email, "Cart");
  //       cartItems.forEach(async (item) => {
  //         try {
  //           await setDoc(doc(userCartRef, item.id), item);
  //         } catch (error) {
  //           console.error("Error saving cart item:", error.message);
  //         }
  //       });
  //       console.log("Cart items saved successfully");
  //     }
  //   };

  //   saveCartItems();
  // }, [cartItems, currentUser]);

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

  const handleCheckboxChange = () => {
    setSameAsShipping(!sameAsShipping);
    if (!sameAsShipping) {
      setBillingAddress({ ...shippingAddress });
    }
  };
  const [totalAmount, setTotalAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(670); // Initialize with $670.00
  const [shipping, setShipping] = useState(0); // Default to 0
  const [tax, setTax] = useState(0); // Default to 0
  const [discount, setDiscount] = useState(0); // Default to 0
  const [total, setTotal] = useState(subtotal); // Initialize total

  // // Update total whenever any value changes
  // const calculateTotal = () => {
  //   const calculatedTotal = subtotal + shipping + tax - discount;
  //   setTotal(calculatedTotal);
  // };
  React.useEffect(() => {
    calculateTotal();
  }, [subtotal, shipping, tax, discount]); // Recalculate when these values change

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

        // Ensure no undefined values in the totals and addresses
        const validatedTotals = {
            discount: totals?.discount ?? 0,
            gstAmount: Math.round(totals?.gstAmount ?? 0),
            subtotal: totals?.subtotal ?? 0,
            total:Math.round(totals?.total ?? 0),
        };

        const validatedShippingAddress = shippingAddress || {};
        const validatedBillingAddress = sameAsShipping ? validatedShippingAddress : (billingAddress || {});

        const shippingBillingData = {
            shippingAddress: validatedShippingAddress,
            billingAddress: validatedBillingAddress,
           
            orderSummary: { // Ensure this is added to the Firestore document
                shippingCharge: checkoutDetails.shippingCharge,
                gstAmount: Math.round(totals?.gstAmount ?? 0),
                discount: totals?.discount || 0,
                totals: validatedTotals, // You can store the whole totals object here
            },
            timestamp: new Date(),
        };

        // Log the data for debugging
        console.log("Shipping Billing Data:", shippingBillingData);

        // Create or update the "latest" document
        await setDoc(cartRef, shippingBillingData, { merge: true });
        console.log("Data successfully updated in Firestore");
    } catch (error) {
        console.error("Error saving data to Firestore:", error.message);
    }
};



  const [orderSummary, setOrderSummary] = useState({});
 
  // const fetchCartItems = async () => {
  //   if (!currentUser) return;
  //   const cartRef = collection(db, "users", currentUser.email, "AddToCart");
  //   const querySnapshot = await getDocs(cartRef);
  //   const items = querySnapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  //   setCartItems(items);
  //   setTotalAmount(
  //     items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  //   );
  // };

  // useEffect(() => {
  //   if (currentUser) fetchCartItems();
  // }, [currentUser]);

 

  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        const user = auth.currentUser;

        if (!user || !user.email) {
          console.error("User not authenticated or email not available");
          return;
        }

        // Reference to the 'latest' document in the 'ShippingBilling' subcollection
        const cartRef = doc(db, "users", user.email, "ShippingBilling", "latest");

        // Fetch the document
        const docSnap = await getDoc(cartRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const total = data.orderSummary?.total || 0; // Default to 0 if total is not found
          setTotalAmount(total);
        } else {
          console.log("No data found in the ShippingBilling collection.");
        }
      } catch (error) {
        console.error("Error fetching total amount:", error.message);
      }
    };

    fetchTotalAmount();
  }, []);

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
        if (!cartSnapshot.exists()) {
            console.error("No such document found!");
            return;
        }

        const data = cartSnapshot.data();
        if (!data || !data.orderSummary) {
            console.error("Order Summary not found in document!");
            return;
        }

        // Safely extract values with default fallbacks
        const shipping = data.orderSummary.shippingCharge || 0;
        const tax = data.orderSummary.gstAmount || 0;
        const discount = data.orderSummary.discount || 0;
        const total = data.orderSummary.totals || 0;

        // Update state with extracted values
        setShipping(shipping);
        setTax(tax);
        setDiscount(discount);
        setTotalAmount(total);

        // Generate address strings
        const shippingAddressString = shippingAddress
            ? Object.entries(shippingAddress)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join("\n")
            : "No shipping address provided";

        const billingAddressString = sameAsShipping
            ? "Same as shipping address"
            : billingAddress
            ? Object.entries(billingAddress)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join("\n")
            : "No billing address provided";

        // Build the order summary message
        const orderSummaryMessage = `
             
*Product Details*
Name: ${product.name}
Quantity: ${checkoutDetails.quantity}
Price (per unit): ₹${product.price}

*Order Summary*
Base Amount: ₹${ totals.subtotal}
Shipping: ₹${checkoutDetails.shippingCharge}
Tax: ₹${totals.gstAmount.toFixed()}
Discount: -₹${totals.discount}
Total: ₹${ totals.total.toFixed()}

*Shipping Address*
${shippingAddressString}

*Billing Address*
${billingAddressString}

*"Thank you for your purchase! We’re thrilled to have your support."*
*Confirming your order details.. 😊*
        `;

        // WhatsApp sharing logic
        const phoneNumber = "7358937529"; // Replace with the target phone number
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderSummaryMessage)}`;
        window.open(url, "_blank");

        // Update state to notify on returning
        localStorage.setItem("orderShared", "true");
    } catch (error) {
        console.error("Error fetching data from Firestore:", error.message);
    }
};

const [baseAmount, setBaseAmount] = useState(113493); // Initial base amount
const [calculatedTotalAmount, setCalculatedTotalAmount] = useState(baseAmount);

useEffect(() => {
  // Calculate the total amount dynamically
  const total = baseAmount + shipping + tax - discount;
  setCalculatedTotalAmount(total > 0 ? total : 0); // Ensure the total is not negative
}, [baseAmount, shipping, tax, discount]); // Recalculate on changes

const handleFieldChange = (setter) => (e) => {
  const value = parseFloat(e.target.value) || 0;
  setter(value);
};

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-0 py-8 ml-48">
        <div className="container mx-auto p-4 max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl ml-4 sm:ml-4 md:ml-4 lg:ml-">
          {/* Stepper */}
          <ol className="flex flex-wrap items-center w-200 sm:w-200  sm:ml-80  space-x-1 sm:space-x-5 text-sm font-medium text-center sm:h-10 h-20 text-gray-500  dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 rtl:space-x-reverse ">
            {steps.map((stepData, index) => (
              <li
                key={index}
                className={`flex items-center ${
                  index <= step
                    ? "text-blue-600 dark:text-blue-500"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              >
                <span
                  className={`flex items-center ml-0 sm:ml-20 justify-center w-6 h-6 text-xs border ${
                    index <= step
                      ? "border-blue-600 dark:border-blue-500"
                      : "border-gray-400 dark:border-gray-600"
                  } rounded-full`}
                >
                  {index + 1}
                </span>
                <span
                  className={`ml-2 ${
                    index <= step ? "font-semibold" : "font-normal"
                  }`}
                >
                  {stepData.label}
                </span>
                {index < steps.length - 1 && (
                  <svg
                    className="w-6 h-3 ms-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 12 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m7 9 4-4-4-4M1 9l4-4-4-4"
                    />
                  </svg>
                )}
              </li>
            ))}
          </ol>

          {/* Step Content */}
          <div className="mt-8">
            {step === 0 && (
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
              <div className="border-b pb-4">
  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 pb-2">
    Product Details
  </h2>
  <div className="text-gray-700 space-y-2">
    <p className="flex justify-between">
      <span className="font-medium">Product Name:</span>
      <span>{product.name}</span>
    </p>
    <p className="flex justify-between">
      <span className="font-medium">Price (per unit):</span>
      <span>₹{product.price}</span>
    </p>
    <p className="flex justify-between">
      <span className="font-medium">Quantity:</span>
      <span>{checkoutDetails.quantity}</span>
    </p>
    <p className="flex justify-between">
      <span className="font-medium">Subtotal:</span>
      <span>₹{totals.subtotal}</span>
    </p>
    <p className="flex justify-between">
      <span className="font-medium">GST (5%):</span>
      <span>₹{totals.gstAmount.toFixed()}</span>
    </p>
    <p className="flex justify-between">
      <span className="font-medium text-red-600">Discount:</span>
      <span className="text-red-600">- ₹{totals.discount}</span>
    </p>
    <p className="flex justify-between">
      <span className="font-medium">Shipping Charge:</span>
      <span>₹{checkoutDetails.shippingCharge}</span>
    </p>
  </div>
  <hr className="my-4 border-gray-300" />
  <h3 className="text-xl font-bold text-gray-900 flex justify-between">
    <span>Total Amount:</span>
    <span className="text-green-600">₹{totals.total.toFixed(2)}</span>
  </h3>
</div>

  {/* Proceed Button */}
  <button
  onClick={() => {
    console.log("Proceed to Checkout button clicked");
    saveShippingBillingData();
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

            {step === 1 && (
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-4xl mx-auto my-10 shadow-lg">
          {/* Payment Header */}
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8 flex items-center justify-center space-x-3">
            <span>Payment</span>
            <FaCreditCard className="text-[#ff0080] animate-bounce" />
          </h1>
        
          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
              Choose a Payment Method
            </h3>
        
            {/* Cash on Delivery */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <input
                type="radio"
                id="cash-on-delivery"
                name="paymentMethod"
                value="cash on delivery"
                checked={paymentMethod === "cash on delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5"
              />
              <label htmlFor="cash-on-delivery" className="text-gray-700 dark:text-gray-300">
                Cash on Delivery
              </label>
            </div>
        
            {/* Credit Card */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <input
                type="radio"
                id="creditCard"
                name="paymentMethod"
                value="creditCard"
                checked={paymentMethod === "creditCard"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5"
              />
              <label htmlFor="creditCard" className="text-gray-700 dark:text-gray-300">
                Credit Card
              </label>
            </div>
        
            {/* Order Summary */}
            {paymentMethod === "cash on delivery" && (
              <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-inner">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                  Order Summary
                </h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
              
                  <p>Sub Total: <span className="font-semibold">₹{totals.subtotal}</span></p>
                  <div className="flex justify-between items-center">
                  <span className="font-medium">Shipping Charge:</span>
                  <span>₹{checkoutDetails.shippingCharge}</span>
                   
                  </div>
                  <div className="flex justify-between items-center">
                  <span className="font-medium">GST (5%):</span>
                  <span>₹{totals.gstAmount.toFixed()}</span>
                   
                  </div>
                  <div className="flex justify-between items-center text-red-500 font-bold">
                  <span className="font-medium text-red-600">Discount:</span>
                  <span className="text-red-600">- ₹{totals.discount}</span>
                  </div>
                </div>
        
                {/* Total */}
                <div className="flex justify-between items-center mt-6 border-t pt-4">
                  <span className="font-bold text-lg text-gray-800 dark:text-white">
                    Total:
                  </span>
                  <span className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  ₹{totals.total.toFixed()}
                  </span>
                </div>
              </div>
            )}
        
        <button
  onClick={async () => {
    try {
      // Save shipping, billing, and checkout details in Firestore
      await saveShippingBillingData(); // Call the function to save the shipping and billing data

      // Save the order details in Firestore
      const userDocRef = doc(db, "users", user.email);
      const cartRef = collection(userDocRef, "buynow order");

      const orderData = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: checkoutDetails.quantity,
        subtotal: totals.subtotal,
        gst: totals.gstAmount,
        discount: totals.discount,
        shippingCharge: checkoutDetails.shippingCharge,
        totalAmount: totals.total,
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        createdAt: new Date().toISOString(), // Optional timestamp
      };

      await setDoc(doc(cartRef), orderData); // Save the order details

      // Proceed to the next step
      handleNext();

      // Show success message using SweetAlert
      await Swal.fire({
        title: "Order Confirmed!",
        text: "Your order has been successfully placed.",
        icon: "success",
        confirmButtonText: "Continue to Payment",
      });

      // Share the order summary (if needed)
      await handleShareOrderSummary();
    } catch (error) {
      console.error("Error saving order details:", error.message);
    }
  }}
  className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-8 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105"
>
  Confirm and Pay
</button>

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
      <Footer />
    </div>
  );
};

export default CartPage;
