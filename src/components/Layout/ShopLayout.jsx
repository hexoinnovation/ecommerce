import React from "react";
import ShopNavbar from "../Products/ShopNavbar";
import Footer from "../Footer/Footer";

const ShopLayout = ({ children }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50">
        <ShopNavbar />
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-gradient-to-br from-gray-800 to-gray-900 text-white py-6">
        <Footer />
      </footer>
    </div>
  );
};

export default ShopLayout;
