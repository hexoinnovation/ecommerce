import React, { useState, useEffect } from 'react';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaEye ,  FaArrowRight} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../Authcontext'; // Access currentUser
import { useNavigate } from 'react-router-dom';
import { db, doc, collection, setDoc, deleteDoc } from '../firebase'; // Firestore methods
import Navbar from './Navbar';
import Footer from '../Footer/Footer';


const CartPage = () => {
  const [step, setStep] = useState(0);
  const { cartItems, removeFromCart } = useCart();
  const { currentUser } = useAuth(); // Access currentUser from AuthContext
  const navigate = useNavigate();

  const steps = [
    
    
    { label: "Details", description: "Enter your details" },
    { label: "Payment", description: "Confirm your order" }
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
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCharge = 50;
  const finalTotal = totalPrice + shippingCharge;

  // Firestore reference for the user's cart subcollection
  const userCartRef = currentUser
    ? collection(doc(db, 'users', currentUser.email), 'cart')
    : null;

  // Sync cart items to Firestore whenever they change
  useEffect(() => {
    if (currentUser && userCartRef) {
      cartItems.forEach(async (item) => {
        await setDoc(doc(userCartRef, item.id), item); // Save each item by ID in Firestore
      });
    }
  }, [cartItems, currentUser]);


  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    company: '',
    address1: '',
    address2: '',
    country: '',
    zipCode: '',
  });

  const [billingAddress, setBillingAddress] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    company: '',
    address1: '',
    address2: '',
    country: '',
    zipCode: '',
  });

  const [sameAsShipping, setSameAsShipping] = useState(false);

  const handleInputChange = (e, addressType) => {
    const { name, value } = e.target;
    if (addressType === 'shipping') {
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


  // Remove item from Firestore when it's removed from the cart
  const handleRemoveFromCart = async (id) => {
    if (currentUser && userCartRef) {
      await deleteDoc(doc(userCartRef, id)); // Delete the item from Firestore
    }
    removeFromCart(id); // Remove from local state
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/view-all');
  };

  const handleBackToProductDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div>
   <Navbar/>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-0 py-8">
    <div className="container mx-auto p-4 max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl ml-4 sm:ml-4 md:ml-4 lg:ml-">
    {/* Stepper */}
    <ol className="flex flex-wrap items-center w-200 sm:w-200 mr-10 sm:ml-80  space-x-2 sm:space-x-8 text-sm font-medium text-center sm:h-10 h-20 text-gray-500 border  border-yellow-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 rtl:space-x-reverse">
      {steps.map((stepData, index) => (
        <li
          key={index}
          className={`flex items-center ${index <= step ? "text-blue-600 dark:text-blue-500" : "text-gray-400 dark:text-gray-600"}`}
        >
          <span
            className={`flex items-center ml-0 sm:ml-20 justify-center w-6 h-6 text-xs border ${index <= step ? "border-blue-600 dark:border-blue-500" : "border-gray-400 dark:border-gray-600"} rounded-full`}
          >
            {index + 1}
          </span>
          <span className={`ml-2 ${index <= step ? "font-semibold" : "font-normal"}`}>
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
        <div className="p-6 bg-gray-100 rounded-lg max-w-6xl ml-80 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping and Billing Section */}
        <div>
          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(shippingAddress).map((field, index) => (
                <input
                  key={index}
                  type="text"
                  name={field}
                  placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  value={shippingAddress[field]}
                  onChange={(e) => handleInputChange(e, "shipping")}
                  className="border rounded p-2 rounded-lg"
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
              className="mr-2"
            />
            <label htmlFor="sameAsShipping" className="text-lg">
              Same as shipping address
            </label>
          </div>
  
          {/* Billing Address */}
          {!sameAsShipping && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Billing Address</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(billingAddress).map((field, index) => (
                  <input
                    key={index}
                    type="text"
                    name={field}
                    placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    value={billingAddress[field]}
                    onChange={(e) => handleInputChange(e, "billing")}
                    className="border rounded p-2 rounded-lg"
                  />
                ))}
              </form>
            </div>
          )}
        </div>
  
        {/* Summary Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Summary</h3>
          <div className="space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <label className="font-semibold">Subtotal:</label>
              <span className="text-lg">${subtotal.toFixed(2)}</span>
            </div>
  
            {/* Shipping */}
            <div className="flex justify-between items-center">
              <label className="font-semibold">Shipping:</label>
              <input
                type="number"
                value={shipping}
                onChange={handleFieldChange(setShipping)}
                className="border rounded p-2 w-24"
              />
            </div>
  
            {/* Tax */}
            <div className="flex justify-between items-center">
              <label className="font-semibold">Tax:</label>
              <input
                type="number"
                value={tax}
                onChange={handleFieldChange(setTax)}
                className="border rounded p-2 w-24"
              />
            </div>
  
            {/* Discount */}
            <div className="flex justify-between items-center">
              <label className="font-semibold">Discount:</label>
              <input
                type="number"
                value={discount}
                onChange={handleFieldChange(setDiscount)}
                className="border rounded p-2 w-24"
              />
            </div>
  
            {/* Total */}
            <div className="flex justify-between items-center mt-4 border-t pt-4">
              <label className="font-bold text-lg">Total:</label>
              <span className="text-xl font-semibold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>


      )}

      
      {step === 1 && (
        <div>
          <h2 className="text-2xl ml-80 font-bold text-gray-900 dark:text-white">Payment</h2>
          <p className="text-gray-600 ml-80 dark:text-gray-400">Confirm your order and proceed.</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 sm:gap-8">
        <button
          onClick={handleBack}
          className="bg-gray-300 ml-80 text-gray-800 px-4 py-2 rounded-md w-full sm:w-auto"
          disabled={step === 0}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
          disabled={step === 3}
        >
          {step === 1 ? "Complete" : "Next"}
        </button>
      </div>
    </div>
  </div>
</div>
<Footer/>
    </div>
  );
};

export default CartPage;
