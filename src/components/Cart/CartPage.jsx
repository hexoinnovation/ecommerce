import React, { useState, useEffect } from "react";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../Authcontext";
import { useNavigate } from "react-router-dom";
import {
  db,
  doc,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from "../firebase";
import { getAuth } from "firebase/auth"; // Firebase Auth
import {
  faTrash,
  faArrowRight,
  faHeart,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaCreditCard } from "react-icons/fa"; // Import a payment-related icon

const CartPage = () => {
  const [step, setStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [billTo, setBillTo] = useState("");
  const [userCartItems, setUserCartItems] = useState([]);
  const [item, setItem] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const { removeFromCart } = useCart();
  const { currentUser } = useAuth();
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
          subtotal,
          shipping,
          tax,
          discount,
          total,
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
        console.log("Fetched data:", data);
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
      if (data) {
        setShippingAddress(data.shippingAddress || {});
        setBillingAddress(data.billingAddress || {});
        setSameAsShipping(data.billingAddress === data.shippingAddress);
        setOrderSummary(data.orderSummary || {});
        setCartItems(data.cartItems || []);
      }
    };

    loadShippingBillingData();
  }, []);

  const fetchCartItems = async () => {
    if (!currentUser) return;
    const cartRef = collection(db, "users", currentUser.email, "AddToCart");
    const querySnapshot = await getDocs(cartRef);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCartItems(items);
    setTotalAmount(
      items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
  };

  useEffect(() => {
    if (currentUser) fetchCartItems();
  }, [currentUser]);

  const [showModal, setShowModal] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false); // Track wishlist state
  const handleWishlistToggle = async (product) => {
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

        // Remove from "Add to Cart"
        await handleRemoveFromCart(product.id, false);
      }

      // Reload the page to reflect the changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const handleRemoveFromCart = async (itemId, updateUI = true) => {
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

      if (updateUI) {
        alert("Your product has been removed from your cart.");

        // Reload the page to reflect the changes
        window.location.reload();
      }
    } catch (error) {
      console.error("Error removing item from Firestore:", error);
    }
  };

  // Open modal
  const openModal = () => setShowModal(true);

  // Close modal
  const closeModal = () => setShowModal(false);

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
  // Calculate the total price and final total
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingCharge = 50;
  const finalTotal = totalPrice + shippingCharge;
  const [subtotal, setSubtotal] = useState(670); // Initialize with $670.00
  const [shipping, setShipping] = useState(0); // Default to 0
  const [tax, setTax] = useState(0); // Default to 0
  const [discount, setDiscount] = useState(0); // Default to 0
  const [total, setTotal] = useState(subtotal); // Initialize total

  // Update total whenever any value changes
  const calculateTotal = () => {
    const calculatedTotal = subtotal + shipping + tax - discount;
    setTotal(calculatedTotal);
  };
  const handleFieldChange = (setter) => (e) => {
    const value = parseFloat(e.target.value) || 0; // Convert input to a number
    setter(value);
  };

  React.useEffect(() => {
    calculateTotal();
  }, [subtotal, shipping, tax, discount]); // Recalculate when these values change


  
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
          {step === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                {cartItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg"
                      >
                        <img
                          src={item.img}
                          alt={item.title}
                          className="h-60 object-cover rounded"
                        />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {item.title}
                        </h3>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <h3 className="text-lg font-semibold">
                          {item.category}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          ₹{item.price}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                        <button
                          onClick={openModal}
                          className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                          aria-label="Remove from Cart"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="h-5 w-5 mr-2"
                          />
                          Remove
                        </button>

                        {/* Modal */}
                        {showModal && (
                          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
                              {/* Close Button */}
                              <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                aria-label="Close Modal"
                              >
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  className="h-5 w-5"
                                />
                              </button>

                              <h2 className="text-xl font-semibold mb-4">
                                Are you sure?
                              </h2>
                              <p className="mb-4">
                                Do you want to remove this item or add it to
                                your wishlist?
                              </p>

                              <div className="flex justify-between">
                                <button
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                                  aria-label="Remove from Cart"
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className="h-5 w-5"
                                  />
                                </button>

                                <button
                                  onClick={() => handleWishlistToggle(item)}
                                  className={`py-2 px-4 text-white rounded flex items-center ${
                                    isWishlist
                                      ? "bg-red-500 hover:bg-red-600"
                                      : "bg-gray-600 hover:bg-gray-700"
                                  }`}
                                >
                                  <FontAwesomeIcon
                                    icon={faHeart}
                                    className={`mr-2 ${
                                      isWishlist ? "text-red-500" : "text-white"
                                    }`}
                                  />
                                  {isWishlist
                                    ? "Remove from Wishlist"
                                    : "Add to Wishlist"}
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
                    {/* Empty Wishlist Image or Icon with animation */}

                    {/* Add any additional animation or image */}
                    <img
                      src="cart.webp" // Replace with your own empty state image or icon
                      alt="Empty Wishlist"
                      className="w-32 h-32 animate-bounce"
                    />
                    <p className="text-gray-700 dark:text-gray-300 text-xl animate-pulse">
                      Your Cart is Empty.
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg h-60">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Order Summary
                </h2>
                <p>Total Items: {cartItems.length}</p>
                <p>Total Amount: ₹{totalAmount}</p>
                <button
    onClick={handleNext}
    className="w-full sm:w-3/4 lg:w-1/2 py-2 bg-blue-500 text-white rounded-lg transition-transform duration-200 ease-in-out hover:bg-blue-600 hover:shadow-lg active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
    aria-label="Proceed to Checkout"
    disabled={cartItems.length === 0}
  >
    <span>Proceed to Checkout</span>
    <FontAwesomeIcon icon={faArrowRight} className="h-5 w-5" />
  </button>
              </div>
            </div>
          )}

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
                    <span className="font-semibold">{cartItems.length}</span>
                  </p>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Total Amount:{" "}
                    <span className="font-semibold">₹{totalAmount}</span>
                  </p>

                  {/* Subtotal */}
                  <div className="flex justify-between items-center mb-4">
                    <label className="font-semibold text-gray-800 dark:text-gray-300">
                      Subtotal:
                    </label>
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between items-center mb-4">
                    <label className="font-semibold text-gray-800 dark:text-gray-300">
                      Shipping:
                    </label>
                    <input
                      type="number"
                      value={shipping}
                      onChange={handleFieldChange(setShipping)}
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
                      value={tax}
                      onChange={handleFieldChange(setTax)}
                      className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-2 w-24 rounded-lg text-gray-800 dark:text-gray-200"
                    />
                  </div>

                  {/* Discount */}
                  <div className="flex justify-between items-center mb-4">
                    <label className="font-semibold text-gray-800 dark:text-gray-300">
                      Discount:
                    </label>
                    <input
                      type="number"
                      value={discount}
                      onChange={handleFieldChange(setDiscount)}
                      className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-2 w-24 rounded-lg text-gray-800 dark:text-gray-200"
                    />
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mt-4 border-t pt-4">
                    <label className="font-bold text-lg text-gray-800 dark:text-white">
                      Total:
                    </label>
                    <span className="text-xl font-semibold text-gray-800 dark:text-white">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>

                  {/* Proceed Button */}
                  <button
  onClick={saveShippingBillingData}
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
                <div>
                  <h1 className="text-2xl font-bold ml-20 t-4p-4 text-center rounded-lg flex items-center space-x-4">
                    <span>Payment</span>
                    <div className="relative">
                      <FaCreditCard className="text-[#ff0080] animate-neon" />{" "}
                      {/* Custom neon pink color */}
                    </div>
                  </h1>

                  {/* Payment Methods */}
                  <div className="mt-6 ml-0">
                    <h3 className="text-xl font-semibold ml-20 mb-4">
                      Choose a Payment Method
                    </h3>

                    {/* Credit Card Option */}
                    <div className="mb-4 ml-20 ">
                      <input
                        type="radio"
                        id="creditCard"
                        name="paymentMethod"
                        value="creditCard"
                      />
                      <label htmlFor="creditCard" className="ml-2">
                        Credit Card
                      </label>
                    </div>

                    {/* PayPal Option */}
                    <div className="mb-4 ml-20">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                      />
                      <label htmlFor="paypal" className="ml-2">
                        PayPal
                      </label>
                    </div>

                    {/* Stripe Option */}
                    <div className="mb-4 ml-20">
                      <input
                        type="radio"
                        id="stripe"
                        name="paymentMethod"
                        value="stripe"
                      />
                      <label htmlFor="stripe" className="ml-2">
                        Stripe
                      </label>
                    </div>

                    {/* Order Summary Section */}
                    <div className="mt-6 ml-20">
                      <h3 className="text-xl font-semibold mb-4">
                        Order Summary
                      </h3>
                      <div className="flex justify-between items-center">
                        <label className="font-semibold ml-20">Subtotal:</label>
                        <span className="text-lg">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center ml-20">
                        <label className="font-semibold">Shipping:</label>
                        <span className="text-lg">
                          ${shippingCharge.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center ml-20">
                        <label className="font-semibold">Total:</label>
                        <span className="text-xl font-semibold">
                          ${finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Payment Form (for Credit Card) */}
                    <div className="mt-6">
                      {document.querySelector(
                        'input[name="paymentMethod"]:checked'
                      )?.value === "creditCard" && (
                        <div>
                          <h4 className="font-semibold">
                            Enter Credit Card Details
                          </h4>
                          <form className="space-y-4">
                            <div>
                              <label
                                htmlFor="cardNumber"
                                className="block text-sm"
                              >
                                Card Number
                              </label>
                              <input
                                type="text"
                                id="cardNumber"
                                className="border rounded p-2 w-full"
                                placeholder="XXXX XXXX XXXX XXXX"
                              />
                            </div>
                            <div className="flex justify-between">
                              <div>
                                <label
                                  htmlFor="expiryDate"
                                  className="block text-sm"
                                >
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  id="expiryDate"
                                  className="border rounded p-2 w-24"
                                  placeholder="MM/YY"
                                />
                              </div>
                              <div>
                                <label htmlFor="cvv" className="block text-sm">
                                  CVV
                                </label>
                                <input
                                  type="text"
                                  id="cvv"
                                  className="border rounded p-2 w-24"
                                  placeholder="CVV"
                                />
                              </div>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Payment Form (for PayPal/Stripe) */}
                      {document.querySelector(
                        'input[name="paymentMethod"]:checked'
                      )?.value === "paypal" && (
                        <div>
                          <h4 className="font-semibold">
                            Redirecting to PayPal...
                          </h4>
                          <p>
                            You will be redirected to PayPal to complete your
                            payment.
                          </p>
                        </div>
                      )}

                      {document.querySelector(
                        'input[name="paymentMethod"]:checked'
                      )?.value === "stripe" && (
                        <div>
                          <h4 className="font-semibold">
                            Redirecting to Stripe...
                          </h4>
                          <p>
                            You will be redirected to Stripe to complete your
                            payment.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirmation Button */}
                    <div className="mt-6">
                      <button
                        onClick={() => handleCheckout()}
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
};

export default CartPage;
