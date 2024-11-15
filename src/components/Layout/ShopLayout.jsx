import React from 'react';
import ShopNavbar from '../Products/ShopNavbar';
import { Sidebar } from '../Sidebar';
import Footer from '../Footer/Footer'; // Ensure the correct path
const ShopLayout = ({ children }) => {
    console.log('ShopLayout is rendering');
  return (
    <div>
      <ShopNavbar/>  {/* This will always render */}
      <div className='flex'>
      <div><Sidebar/></div>
      <div><main>{children}</main></div>  {/* This renders whatever is passed as children */}
      </div>
      
      <Footer />  {/* This will always render */}
    </div>
  );
};

export default ShopLayout;
