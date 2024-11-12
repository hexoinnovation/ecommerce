import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { ShoppingCartIcon } from '@heroicons/react/outline';
import Popup from "../Popup/Popup"; // Ensure Popup is correctly imported
import Img6 from "../../assets/shirt/shirt.png";
import Img7 from "../../assets/shirt/shirt2.png";
import Img8 from "../../assets/shirt/shirt3.png";

// Data with correct image paths
const ProductsData = [
  {
    id: 12,
    img: Img6,
    title: "Product 12",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...Lorem ipsum dolor sit amet, consectetur adipiscing elit...Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    color: "Blue",
    rating: 4,
    price: 999,
  },
  {
    id: 13,
    img: Img7,
    title: "Product 13",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    color: "White",
    rating: 5,
    price: 1299,
    
  },
  {
    id: 14,
    img: Img8,
    title: "Product 14",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    color: "Pink",
    rating: 3,
    price: 799,
    
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
    <div className="container">
      <div className="text-left mb-24">
        <p className="text-sm text-primary">Top Rated Products for you</p>
        <h1 className="text-3xl font-bold">Best Products</h1>
        <p className="text-xs text-gray-400">Browse our top-rated selections.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 md:gap-5 place-items-center">
        {ProductsData.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl bg-white hover:bg-black/80 hover:text-white shadow-xl group max-w-[300px]"
          >
            <div className="h-[100px]">
              <img
                src={product.img}
                alt={product.title}
                className="max-w-[140px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300"
              />
            </div>

            <div className="p-4 text-center">
              <div className="w-full flex items-center justify-center gap-1">
                {[...Array(product.rating)].map((_, index) => (
                  <FaStar key={index} className="text-yellow-500" />
                ))}
              </div>
              <h1 className="text-xl font-bold">{product.title}</h1>
              <p className="text-gray-500 group-hover:text-white duration-300 text-sm">
                {product.description}
              </p>
              <button
                onClick={() => openPopup(product)}
                className="bg-primary text-white py-1 px-4 rounded-full mt-4 flex items-center gap-2 ml-16"
              >
                 View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative">
            {/* Close Button Styling */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-5 text-gray-500 text-3xl font-bold bg-white p-2 rounded-full hover:bg-gray-100 mt-15"
            >
              X
            </button>

            <Popup product={selectedProduct} onClose={closePopup} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopProducts;
