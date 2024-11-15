import React from "react";
import ShopNavbar from "./ShopNavbar"; // ShopNavbar includes the sidebar
import { Route, Routes } from "react-router-dom";
import Footer from "../Footer/Footer";
import PhonePage from "./ProductCategories/PhonePage";
import LaptopPage from "./ProductCategories/LaptopPage";
import CameraPage from "./ProductCategories/CameraPage";
import { Sidebar } from "../Sidebar";

const ViewAllProducts = () => {
  return (
    <>
  <ShopNavbar/>
 <div className="flex">
      <div><Sidebar/> </div>{/* Sidebar inside ShopNavbar */}
   
      
        {/* Content area: Routes for different product categories */}
        
        <div><PhonePage/>
        <LaptopPage/></div>
        </div>
          <Routes>
            <Route path="/phone" element={<PhonePage />} />
            <Route path="/laptop" element={<LaptopPage />} />
            <Route path="/camera" element={<CameraPage />} />
          </Routes>
       
        
      <Footer />
    </>
  );
};

export default ViewAllProducts;
