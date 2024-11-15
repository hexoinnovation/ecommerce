import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaStar } from "react-icons/fa";

// Updated ProductsData (filtered for laptop products)
const ProductsData = [
  {
    id: 1,
    title: "MacBook Pro 16-inch",
    color: "Space Gray",
    price: 239999,
    description: "Apple MacBook Pro with M1 Pro chip.",
    rating: 4.9,
    img: "https://via.placeholder.com/300x300?text=Laptop+Image+1", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Laptop+Image+1", "https://via.placeholder.com/300x300?text=Laptop+Image+2", "https://via.placeholder.com/300x300?text=Laptop+Image+3"],
  },
  {
    id: 2,
    title: "Dell XPS 13",
    color: "Platinum Silver",
    price: 149999,
    description: "Dell XPS 13 with Intel Core i7 processor.",
    rating: 4.7,
    img: "https://via.placeholder.com/300x300?text=Laptop+Image+2", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Laptop+Image+2", "https://via.placeholder.com/300x300?text=Laptop+Image+3", "https://via.placeholder.com/300x300?text=Laptop+Image+4"],
  },
  {
    id: 3,
    title: "HP Spectre x360",
    color: "Nightfall Black",
    price: 134999,
    description: "HP Spectre x360 with Intel i7, 16GB RAM.",
    rating: 4.6,
    img: "https://via.placeholder.com/300x300?text=Laptop+Image+3", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Laptop+Image+3", "https://via.placeholder.com/300x300?text=Laptop+Image+4", "https://via.placeholder.com/300x300?text=Laptop+Image+5"],
  },
  {
    id: 4,
    title: "Lenovo ThinkPad X1 Carbon",
    color: "Black",
    price: 119999,
    description: "Lenovo ThinkPad X1 Carbon with Intel Core i5.",
    rating: 4.8,
    img: "https://via.placeholder.com/300x300?text=Laptop+Image+4", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Laptop+Image+4", "https://via.placeholder.com/300x300?text=Laptop+Image+5", "https://via.placeholder.com/300x300?text=Laptop+Image+6"],
  },
  {
    id: 5,
    title: "Asus ROG Zephyrus G14",
    color: "Moonlight White",
    price: 149999,
    description: "Asus ROG Zephyrus G14, a gaming laptop with AMD Ryzen 9.",
    rating: 4.7,
    img: "https://via.placeholder.com/300x300?text=Laptop+Image+5", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Laptop+Image+5", "https://via.placeholder.com/300x300?text=Laptop+Image+6", "https://via.placeholder.com/300x300?text=Laptop+Image+7"],
  },
];

const LaptopPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle image click to navigate to product detail page
  const handleImageClick = (id) => {
    navigate(`/product/${id}`);
  };

  // Handle View All Products Button
  const handleViewAllClick = () => {
    navigate("/view-all");
  };

  return (
    <div className="mt-20 mb-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p className="text-sm text-primary">Top Selling Laptops for You</p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-4">
            Laptops
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-300 mt-2">
            Explore our latest collection of laptops for work and play.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {ProductsData.map((data) => (
            <div
              key={data.id}
              className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
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
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {data.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{data.color}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-3">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`text-yellow-400 ${index < Math.round(data.rating) ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    ({data.rating.toFixed(1)})
                  </span>
                </div>

                {/* Price */}
                <div className="mt-3 text-lg font-semibold text-gray-800 dark:text-white">
                  ₹{data.price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-10">
          <button
            onClick={handleViewAllClick}
            className="bg-primary text-white py-3 px-8 rounded-md font-semibold text-lg transition-colors duration-300 hover:bg-primary-dark focus:outline-none"
          >
            View All Laptops
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaptopPage;
