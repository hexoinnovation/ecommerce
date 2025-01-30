import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { ShoppingCartIcon } from "@heroicons/react/outline";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Update with your Firebase config path
import Popup from "../Popup/Popup";

const TopProducts = () => {
  const [bestProducts, setBestProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Function to fetch products from Firestore
const fetchBestProducts = async () => {
  try {
    const productsCollection = collection( db ,"admins",
      "nithya1@gmail.com",
      "products"); // Replace with your Firestore collection name
    const q = query(productsCollection, where("offers", "==", "best_product"));
    const querySnapshot = await getDocs(q);

    // Map and randomize the fetched products
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Randomize the products and pick the first 4
    const randomProducts = products
      .sort(() => Math.random() - 0.5) // Randomize order
      .slice(0, 4); // Pick the first 4 products

    setBestProducts(randomProducts);
  } catch (error) {
    console.error("Error fetching best products: ", error);
  }
};

useEffect(() => {
  fetchBestProducts();
}, []);


  const openPopup = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-200">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-400 uppercase tracking-wider">
            Top Rated Products for You
          </p>
          <h1 className="text-4xl font-bold text-white mb-3">Best Products</h1>
          <p className="text-gray-300">Browse our top-rated selections.</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {bestProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              
              {/* Product Image */}
              <div className="relative h-56">
                <img
                  src={product.image} // Ensure your Firestore data contains an 'img' field with the image URL
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold uppercase px-2 py-1 rounded">
    Hot Deal
  </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Rating */}
                {/* <div className="flex justify-center gap-1 mb-3">
                  {[...Array(product.rating)].map((_, index) => (
                    <FaStar key={index} className="text-yellow-400" />
                  ))}
                </div> */}
                {/* Title */}
                <h2 className="text-lg font-semibold text-white mb-2">
                  {product.name}
                </h2>
                {/* Description */}
                <p className="text-sm text-gray-300 line-clamp-3 mb-4">
                  {product.description}
                </p>
                {/* Price */}
                <div className="flex items-center gap-2">
  <p className="text-lg font-semibold text-white">₹{product.price}</p>
  {product.discount && (
    <p className="text-sm font-semibold text-green-500 line-through">
      ₹{product.discount}
    </p>
  )}
</div>
              </div>
              {/* Actions */}
              <div className="p-4 bg-gray-700 flex justify-between items-center">
                <button
                  onClick={() => openPopup(product)}
                  className="text-sm bg-black text-white py-2 px-4 rounded-full hover:bg-gray-900 transition"
                >
                  View Details
                </button>
                <button   onClick={() => openPopup(product)} className="text-sm bg-gray-600 text-white py-2 px-4 rounded-full hover:bg-gray-700 transition flex items-center">
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Popup */}
        {isPopupOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full relative shadow-xl">
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-gray-500 text-xl font-bold hover:text-gray-700 focus:outline-none"
              >
                &times;
              </button>
              <Popup product={selectedProduct} onClose={closePopup} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TopProducts;
