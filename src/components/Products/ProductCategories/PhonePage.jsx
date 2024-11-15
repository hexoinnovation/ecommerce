import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaStar } from "react-icons/fa";
import Img1 from "../../../assets/common/dress1.jpg";
// import Img2 from "../../../assets/common/e7.webp";
// import Img3 from "../../assets/common/e3.jpg";
// import Img4 from "../../assets/shirt/shirt.png";
// import Img5 from "../../assets/common/e6.jpg";
// import Img6 from "../../assets/shirt/shirt.png";
// import Img7 from "../../assets/shirt/shirt2.png";
// import Img8 from "../../assets/shirt/shirt3.png";

// Updated ProductsData (filtered for phone products)
const ProductsData = [
  {
    id: 1,
    title: "iPhone 12 Pro Max",
    color: "Pacific Blue",
    price: 99999,
    description: "This is a sample iPhone.",
    rating: 4.7,
    img: Img1, // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Phone+Image+1", "https://via.placeholder.com/300x300?text=Phone+Image+2", "https://via.placeholder.com/300x300?text=Phone+Image+3"],
  },
  {
    id: 2,
    title: "Samsung Galaxy S21",
    color: "Phantom Gray",
    price: 79999,
    description: "This is a Samsung Galaxy phone.",
    rating: 4.5,
    img: "https://via.placeholder.com/300x300?text=Phone+Image+2", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Phone+Image+2", "https://via.placeholder.com/300x300?text=Phone+Image+3", "https://via.placeholder.com/300x300?text=Phone+Image+4"],
  },
  {
    id: 3,
    title: "OnePlus 9 Pro",
    color: "Morning Mist",
    price: 64999,
    description: "OnePlus flagship phone with fast performance.",
    rating: 4.6,
    img: "https://via.placeholder.com/300x300?text=Phone+Image+3", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Phone+Image+3", "https://via.placeholder.com/300x300?text=Phone+Image+4", "https://via.placeholder.com/300x300?text=Phone+Image+5"],
  },
  {
    id: 4,
    title: "Google Pixel 6",
    color: "Stormy Black",
    price: 59999,
    description: "Google's flagship phone with an amazing camera.",
    rating: 4.8,
    img: "https://via.placeholder.com/300x300?text=Phone+Image+4", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Phone+Image+4", "https://via.placeholder.com/300x300?text=Phone+Image+5", "https://via.placeholder.com/300x300?text=Phone+Image+6"],
  },
  {
    id: 5,
    title: "Xiaomi Mi 11",
    color: "Horizon Blue",
    price: 39999,
    description: "Xiaomi Mi series with top-notch features.",
    rating: 4.3,
    img: "https://via.placeholder.com/300x300?text=Phone+Image+5", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Phone+Image+5", "https://via.placeholder.com/300x300?text=Phone+Image+6", "https://via.placeholder.com/300x300?text=Phone+Image+7"],
  },
];

const PhonePage = () => {
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
          <p className="text-sm text-primary">Top Selling Phones for You</p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-4">
            Phones
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-300 mt-2">
            Explore our latest collection of top smartphones with amazing features.
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
            View All Phones
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhonePage;
