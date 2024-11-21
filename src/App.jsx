import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import TopProducts from './components/TopProducts/TopProducts';
import Banner from './components/Banner/Banner';
import Subscribe from './components/Subscribe/Subscribe';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import Popup from './components/Popup/Popup';
import SimpleLayout from './components/Layout/SimpleLayout'; // Import SimpleLayout
import CartPage from './components/Cart/CartPage';
import { AuthProvider } from './components/Authcontext'; // Adjust the path
import { CartProvider } from './context/CartContext'; // Ensure you're importing your CartProvider
import AccountPage from './components/Navbar/AccountPage'; // Adjust the path to AccountPage.js
import CheckoutPage from './components/Navbar/CheckoutPage';
// import { CheckoutPage } from './components/Navbar/CheckoutPage';
import ShopNavbar from './components/Products/ShopNavbar';
import ShopLayout from './components/Layout/ShopLayout';
import MyOrders from './components/Navbar/MyOrders';

import { Products } from './components/Products/Products';
import { ShopPage } from './components/Products/ShopPage';
import ProductDetail from './components/Products/ProductDetail';
import { ProductsProvider } from './context/ProductsContext';


const App = () => {
  const [orderPopup, setOrderPopup] = useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: 'ease-in-sine',
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <AuthProvider>
      <CartProvider> {/* Ensure CartProvider is wrapping everything */}
        <ProductsProvider>
        <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
          
          <Routes>
            {/* Full Layout Route */}
            <Route
              path="/"
              element={
                <>
                  <Navbar handleOrderPopup={handleOrderPopup} />
                  <Hero handleOrderPopup={handleOrderPopup} />
                  <ShopPage/>
                  <TopProducts handleOrderPopup={handleOrderPopup} />
                  <Banner />
                  <Subscribe />
                  <Testimonials />
                  <Footer />
                </>
              }
            />
          <Route path="/myorders" element={<MyOrders />} />
          
          <Route path="/checkout" element={<CheckoutPage />} />
            {/* Account Page Route */}
            <Route path="/account" element={<AccountPage />} />

            {/* Product Detail Route wrapped with SimpleLayout */}
            <Route
              path="/product/:id"
              element={
                <SimpleLayout>
                  <ProductDetail />
                </SimpleLayout>
              }
            />
          
         
          {/* Individual product detail page */}
          {/* <Route path="/product/:id" element={<ShopPage />} /> */}

            {/* Cart Page Route wrapped with SimpleLayout */}
            <Route
              path="/cart"
              element={
                <SimpleLayout>
                  <CartPage />
                </SimpleLayout>
              }
            />
            <Route path='/view-all' element={<ShopLayout><Products/></ShopLayout>}/>
            <Route path="/product/:id" element={<ShopLayout><ProductDetail /></ShopLayout>} />

          </Routes>
          
          {/* Popup for Order */}
          <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
        </div>
        </ProductsProvider>
      </CartProvider>  
    </AuthProvider>
    
  );
};

export default App;
