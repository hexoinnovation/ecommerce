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

        {/* ProductDetail Route wrapped with SimpleLayout */}
        <Route
          path="/product/:id"
          element={
            <SimpleLayout>
              <ProductDetail/>
            </SimpleLayout>
          }
        />

        {/* ViewAllProducts Route wrapped with SimpleLayout */}
        <Route
          path="/view-all"
          element={
            <SimpleLayout>
              <ViewAllProducts />
            </SimpleLayout>
          }
        />
      </Routes>

      {/* Popup for Order */}
      <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
    </div>
  );
};

export default App;
