import React from 'react';
import Navbar from '../Navbar/Navbar'; // Ensure the correct path
import Footer from '../Footer/Footer'; // Ensure the correct path

const SimpleLayout = ({ children }) => {
    console.log('SimpleLayout is rendering');
  return (
    <div>
      <Navbar />  {/* This will always render */}
      <main>{children}</main>  {/* This renders whatever is passed as children */}
      <Footer />  {/* This will always render */}
    </div>
  );
};

export default SimpleLayout;
