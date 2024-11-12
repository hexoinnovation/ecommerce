import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Img1 from "../../assets/common/dress1.jpg";
import Img2 from "../../assets/common/e7.webp";
import Img3 from "../../assets/common/e3.jpg";
import Img4 from "../../assets/shirt/shirt.png";
import Img5 from "../../assets/common/e6.jpg";
import Img6 from "../../assets/shirt/shirt.png";
import Img7 from "../../assets/shirt/shirt2.png";
import Img8 from "../../assets/shirt/shirt3.png";

import { FaStar } from "react-icons/fa";
import { FaArrowDown, FaArrowUp } from "react-icons/fa"; // Import arrow icons

// Updated ProductsData with more products
export const ProductsData = [
    {
      id: 1,
      title: "Product 1",
      color: "Red",
      price: 999,
      description: "This is a sample product.",
      rating: 4,
      img: Img1, // main image
      images: [  // An array of images for the product
       Img1,Img2,Img3
      ]
    },
    {
      id: 2,
      title: "Product 2",
      color: "Blue",
      price: 1299,
      description: "This is another sample product.",
      rating: 4.5,
      img: Img2, // main image
      images: [  // An array of images for the product
        Img2,Img3,Img4
      ]
    },
    {
      id: 3,
      title: "Product 3",
      color: "Green",
      price: 1799,
      description: "A green sample product.",
      rating: 4.2,
      img: Img3, // main image
      images: [  // An array of images for the product
        Img3,Img1,Img5
      ]
    },
    {
      id: 4,
      title: "Product 4",
      color: "Black",
      price: 2499,
      description: "A stylish black product.",
      rating: 5.0,
      img: Img4, // main image
      images: [  // An array of images for the product
        Img2,Img3,Img4
      ]
    },
    {
      id: 5,
      title: "Product 5",
      color: "Yellow",
      price: 1899,
      description: "A sample product with yellow color.",
      rating: 4.6,
      img: Img5, // main image
      images: [  // An array of images for the product
        Img3,Img1,Img5
      ]
    },
    {
      id: 6,
      title: "Product 6",
      color: "White",
      price: 1599,
      description: "A simple white product for casual wear.",
      rating: 3.8,
      img: Img1, // main image
      images: [  // An array of images for the product
        Img2,Img3,Img4
      ]
    },
    {
      id: 7,
      title: "Product 7",
      color: "Pink",
      price: 1099,
      description: "A cute pink product.",
      rating: 4.4,
      img: Img2, // main image
      images: [  // An array of images for the product
        Img3,Img1,Img5
      ]
    },
    {
      id: 8,
      title: "Product 8",
      color: "Orange",
      price: 899,
      description: "A vibrant orange product.",
      rating: 3.9,
      img: Img2, // main image
      images: [  // An array of images for the product
        Img2,Img3,Img4
      ]
    },
    {
      id: 9,
      title: "Product 9",
      color: "Purple",
      price: 2199,
      description: "A purple product.",
      rating: 4.7,
      img: Img3, // main image
      images: [  // An array of images for the product
        Img3,Img1,Img5
      ]
    },
    {
      id: 10,
      title: "Product 10",
      color: "Gray",
      price: 2599,
      description: "A stylish gray product.",
      rating: 4.5,
      img: Img5, // main image
      images: [  // An array of images for the product
        Img2,Img3,Img4
      ]
    },
    {
      id: 11,
      title: "Product 11",
      color: "Brown",
      price: 1899,
      description: "A brown leather product.",
      rating: 4.3,
      img: Img2, // main image
      images: [  // An array of images for the product
        Img3,Img1,Img5
      ]
    },
    {
      id: 12,
      title: "Product 12",
      color: "Silver",
      price: 3999,
      description: "A shiny silver product.",
      rating: 4.8,
      img: Img6, // main image
      images: [  // An array of images for the product
        Img2,Img3,Img6
      ]
    },
    {
      id: 13,
      title: "Product 13",
      color: "Silver",
      price: 1999,
      description: "A shiny silver product.",
      rating: 4.8,
      img: Img7, // main image
      images: [  // An array of images for the product
        Img2,Img3,Img7
      ]
    },
    {
      id: 14,
      title: "Product 14",
      color: "Silver",
      price: 2999,
      description: "A shiny silver product.",
      rating: 4.8,
      img: Img8, // main image
      images: [  // An array of images for the product
        Img2,Img8,Img4
      ]
    }
];

const Products = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [visibleProducts, setVisibleProducts] = useState(5); // Initially, show 5 products
  const [isLoaded, setIsLoaded] = useState(false); // Track if products are loaded

  // Handle image click to navigate to product detail page
  const handleImageClick = (id) => {
    navigate(`/product/${id}`);
  };

  // Handle Load More click
  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 8); // Load more products
    setIsLoaded(true); // Set loaded state
  };

  // Handle Load Less click
  const handleLoadLess = () => {
    setVisibleProducts(5); // Reset to the initial 5 products
    setIsLoaded(false); // Reset loaded state
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
  };

  return (
    <div className="mt-14 mb-12">
      <div className="container">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p className="text-sm text-primary">Top Selling Products for you</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-xs text-gray-400 dark:text-gray-300">
            Explore our latest collection of stylish products for every occasion.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {ProductsData.slice(0, visibleProducts).map((data) => (
            <div
              key={data.id}
              className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={data.img}
                  alt={data.title}
                  className="h-[220px] w-full object-cover cursor-pointer transition-transform transform group-hover:scale-110"
                  onClick={() => handleImageClick(data.id)}
                />
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{data.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{data.color}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`text-yellow-400 ${index < Math.round(data.rating) ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-gray-600 dark:text-gray-400">({data.rating.toFixed(1)})</span>
                </div>

                {/* Price */}
                <div className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
                  ₹{data.price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More / Load Less Links */}
        <div className="text-center mt-8">
          {/* If products are loaded, show Load Less */}
          {isLoaded ? (
            <span
              onClick={handleLoadLess}
              className="dark:text-primary text-black font-bold cursor-pointer hover:text-primary dark:hover:text-white transition-colors duration-300"
            >
              <FaArrowUp className="inline mr-2" />
              Load Less
            </span>
          ) : (
            // If not loaded, show Load More
            <span
              onClick={handleLoadMore}
              className="dark:text-primary text-black font-bold cursor-pointer hover:text-primary dark:hover:text-white transition-colors duration-300"
            >
              <FaArrowDown className="inline mr-2" />
              Load More
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
