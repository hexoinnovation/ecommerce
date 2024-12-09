import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../Authcontext'; // Access currentUser
import { useNavigate } from 'react-router-dom';
import { db, doc, collection, setDoc, deleteDoc } from '../firebase'; // Firestore methods
import Navbar from './Navbar';
import Footer from '../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaCreditCard } from 'react-icons/fa'; // Import a payment-related icon
import { faTrash , faArrowRight,faHeart,faTimes} from '@fortawesome/free-solid-svg-icons';
const CartPage = () => {
  const [totalAmount, setTotalAmount] = useState(0);
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
         <div className="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg max-w-7xl mx-auto ml-60">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Shipping and Billing Section */}
           <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
             <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
               Shipping and Billing Details
             </h3>
       
             {/* Shipping Address */}
             <div className="mb-6">
               <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-300">Shipping Address</h4>
               <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {Object.keys(shippingAddress).map((field, index) => (
                   <input
                     key={index}
                     type="text"
                     name={field}
                     placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
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
               <label htmlFor="sameAsShipping" className="text-lg text-gray-800 dark:text-gray-300">
                 Same as shipping address
               </label>
             </div>
       
             {/* Billing Address */}
             {!sameAsShipping && (
               <div>
                 <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-300">Billing Address</h4>
                 <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {Object.keys(billingAddress).map((field, index) => (
                     <input
                       key={index}
                       type="text"
                       name={field}
                       placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
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
             <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Order Summary</h3>
             <p className="mb-4 text-gray-700 dark:text-gray-300">Total Items: <span className="font-semibold">{cartItems.length}</span></p>
             <p className="mb-4 text-gray-700 dark:text-gray-300">Total Amount: <span className="font-semibold">₹{totalAmount}</span></p>
       
             {/* Subtotal */}
             <div className="flex justify-between items-center mb-4">
               <label className="font-semibold text-gray-800 dark:text-gray-300">Subtotal:</label>
               <span className="text-lg font-semibold text-gray-800 dark:text-white">₹{subtotal.toFixed(2)}</span>
             </div>
       
             {/* Shipping */}
             <div className="flex justify-between items-center mb-4">
               <label className="font-semibold text-gray-800 dark:text-gray-300">Shipping:</label>
               <input
                 type="number"
                 value={shipping}
                 onChange={handleFieldChange(setShipping)}
                 className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-2 w-24 rounded-lg text-gray-800 dark:text-gray-200"
               />
             </div>
       
             {/* Tax */}
             <div className="flex justify-between items-center mb-4">
               <label className="font-semibold text-gray-800 dark:text-gray-300">Tax:</label>
               <input
                 type="number"
                 value={tax}
                 onChange={handleFieldChange(setTax)}
                 className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-2 w-24 rounded-lg text-gray-800 dark:text-gray-200"
               />
             </div>
       
             {/* Discount */}
             <div className="flex justify-between items-center mb-4">
               <label className="font-semibold text-gray-800 dark:text-gray-300">Discount:</label>
               <input
                 type="number"
                 value={discount}
                 onChange={handleFieldChange(setDiscount)}
                 className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 p-2 w-24 rounded-lg text-gray-800 dark:text-gray-200"
               />
             </div>
       
             {/* Total */}
             <div className="flex justify-between items-center mt-4 border-t pt-4">
               <label className="font-bold text-lg text-gray-800 dark:text-white">Total:</label>
               <span className="text-xl font-semibold text-gray-800 dark:text-white">₹{total.toFixed(2)}</span>
             </div>
       
             {/* Proceed Button */}
             <button
  onClick={handleNext}
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
        <div className="p-6 bg-gray-100 rounded-lg max-w-6xl ml-80 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div>
        <h1 className="text-2xl font-bold ml-0 t-4p-4 text-center rounded-lg flex items-center space-x-4">
  <span>Payment</span>
  <div className="relative">
  <FaCreditCard className="text-[#ff0080] animate-neon" /> {/* Custom neon pink color */}
</div>
</h1>
       
    
        {/* Payment Methods */}
        <div className="mt-6 ml-0">
          <h3 className="text-xl font-semibold mb-4">Choose a Payment Method</h3>
    
          {/* Credit Card Option */}
          <div className="mb-4">
            <input type="radio" id="creditCard" name="paymentMethod" value="creditCard" />
            <label htmlFor="creditCard" className="ml-2">Credit Card</label>
          </div>
    
          {/* PayPal Option */}
          <div className="mb-4">
            <input type="radio" id="paypal" name="paymentMethod" value="paypal" />
            <label htmlFor="paypal" className="ml-2">PayPal</label>
          </div>
    
          {/* Stripe Option */}
          <div className="mb-4">
            <input type="radio" id="stripe" name="paymentMethod" value="stripe" />
            <label htmlFor="stripe" className="ml-2">Stripe</label>
          </div>
    
          {/* Order Summary Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between items-center">
              <label className="font-semibold">Subtotal:</label>
              <span className="text-lg">${totalPrice.toFixed(2)}</span>
            </div>
    
            <div className="flex justify-between items-center">
              <label className="font-semibold">Shipping:</label>
              <span className="text-lg">${shippingCharge.toFixed(2)}</span>
            </div>
    
            <div className="flex justify-between items-center">
              <label className="font-semibold">Total:</label>
              <span className="text-xl font-semibold">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
    
          {/* Payment Form (for Credit Card) */}
          <div className="mt-6">
            {document.querySelector('input[name="paymentMethod"]:checked')?.value === 'creditCard' && (
              <div>
                <h4 className="font-semibold">Enter Credit Card Details</h4>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm">Card Number</label>
                    <input type="text" id="cardNumber" className="border rounded p-2 w-full" placeholder="XXXX XXXX XXXX XXXX" />
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm">Expiry Date</label>
                      <input type="text" id="expiryDate" className="border rounded p-2 w-24" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm">CVV</label>
                      <input type="text" id="cvv" className="border rounded p-2 w-24" placeholder="CVV" />
                    </div>
                  </div>
                </form>
              </div>
            )}
    
            {/* Payment Form (for PayPal/Stripe) */}
            {document.querySelector('input[name="paymentMethod"]:checked')?.value === 'paypal' && (
              <div>
                <h4 className="font-semibold">Redirecting to PayPal...</h4>
                <p>You will be redirected to PayPal to complete your payment.</p>
              </div>
            )}
    
            {document.querySelector('input[name="paymentMethod"]:checked')?.value === 'stripe' && (
              <div>
                <h4 className="font-semibold">Redirecting to Stripe...</h4>
                <p>You will be redirected to Stripe to complete your payment.</p>
              </div>
            )}
          </div>
    
          {/* Confirmation Button */}
          <div className="mt-6">
            <button
              onClick={() => handleCheckout()} 
              className="bg-green-600 text-white px-6 py-2 rounded-md w-full sm:w-auto"
            >
              Confirm and Pay
            </button>
          </div>
        </div>
      </div>
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
