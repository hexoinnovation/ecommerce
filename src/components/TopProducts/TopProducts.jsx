import { ShoppingCartIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { default as Img7 } from "../../assets/women/women.png";
import {
  default as Img10,
  default as Img8,
} from "../../assets/women/women2.jpg";
import Img6 from "../../assets/women/women4.jpg";
import Popup from "../Popup/Popup";

const ProductsData = [
  {
    id: 8,
    img: Img6,
    title: "Product 8",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    color: "Blue",
    rating: 4,
    price: 999,
  },
  {
    id: 9,
    img: Img7,
    title: "Product 9",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    color: "White",
    rating: 5,
    price: 1299,
  },
  {
    id: 10,
    img: Img8,
    title: "Product 10",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    color: "Pink",
    rating: 3,
    price: 799,
  },
  {
    id: 12,
    img: Img10,
    title: "Product 12",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    color: "Purple",
    rating: 4,
    price: 1199,
  },
];

const TopProducts = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openPopup = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
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
          {ProductsData.map((product) => (
            <div
              key={product.id}
              className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative h-56">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(product.rating)].map((_, index) => (
                    <FaStar key={index} className="text-yellow-400" />
                  ))}
                </div>
                {/* Title */}
                <h2 className="text-lg font-semibold text-white mb-2">
                  {product.title}
                </h2>
                {/* Description */}
                <p className="text-sm text-gray-300 line-clamp-3 mb-4">
                  {product.description}
                </p>
                {/* Price */}
                <p className="text-lg font-semibold text-white">₹{product.price}</p>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-700 flex justify-between items-center">
                <button
                  onClick={() => openPopup(product)}
                  className="text-sm bg-black text-white py-2 px-4 rounded-full hover:bg-gray-900 transition"
                >
                  View Details
                </button>
                <button className="text-sm bg-gray-600 text-white py-2 px-4 rounded-full hover:bg-gray-700 transition flex items-center">
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Popup */}
        {isPopupOpen && (
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
