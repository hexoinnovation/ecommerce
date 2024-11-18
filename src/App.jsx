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
import Products from './components/Products/Products';
import ViewAllProducts from './components/Products/ViewAllProducts';
import SimpleLayout from './components/Layout/SimpleLayout'; // Import SimpleLayout
import ProductDetail from './components/Products/ProductDetail';
import CartPage from './components/Cart/CartPage';
import { AuthProvider } from './components/Authcontext'; // Adjust the path
import { CartProvider } from './context/CartContext'; // Ensure you're importing your CartProvider
import AccountPage from './components/Navbar/AccountPage'; // Adjust the path to AccountPage.js

import PhonePage from './components/Products/ProductCategories/PhonePage';
import LaptopPage from './components/Products/ProductCategories/LaptopPage';
import ShopNavbar from './components/Products/ShopNavbar';
import ShopLayout from './components/Layout/ShopLayout';
import CameraPage from './components/Products/ProductCategories/CameraPage';
import { Sidebar } from './components/Sidebar';


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
    <CartProvider>  {/* Ensure CartProvider is wrapping everything */}
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
        
        <Routes>
          {/* Full Layout Route */}
          <Route
            path="/"
            element={
              <>
                <Navbar handleOrderPopup={handleOrderPopup} />
                <Hero handleOrderPopup={handleOrderPopup} />
                <Products />
                <TopProducts handleOrderPopup={handleOrderPopup} />
                <Banner />
                <Subscribe />
                <Testimonials />
                <Footer />
              </>
            }
          />
{/* Account Page Route */}
<Route path="/account" element={<AccountPage />} />
          {/* ProductDetail Route wrapped with SimpleLayout */}
          <Route
            path="/product/:id"
            element={
              <SimpleLayout>
                <ProductDetail />
              </SimpleLayout>
            }
          />

          {/* ViewAllProducts Route wrapped with SimpleLayout */}
          <Route
            path="/view-all"
            element={
              
                <ViewAllProducts />
            }
          />
          {/* Cart Page Route wrapped with SimpleLayout */}
          <Route
            path="/cart"
            element={
              <SimpleLayout>
                <CartPage />
              </SimpleLayout>
            }
          />
          <Route path='/phone' element={<ShopLayout><PhonePage/></ShopLayout>}></Route>
          <Route path='/laptop' element={<ShopLayout><LaptopPage/></ShopLayout>}></Route>
          <Route path='/camera' element={<ShopLayout><CameraPage/></ShopLayout>}></Route>
          
        </Routes>

        {/* Popup for Order */}
        <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
      </div>
    
    </CartProvider>  
    </AuthProvider>
  );
};

export default App;
