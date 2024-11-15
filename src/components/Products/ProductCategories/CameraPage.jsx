import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaStar } from "react-icons/fa";

// Updated ProductsData for Camera products
const ProductsData = [
  {
    id: 1,
    title: "Canon EOS 90D",
    color: "Black",
    price: 84999,
    description: "Canon EOS 90D DSLR Camera with 32.5 MP Sensor.",
    rating: 4.8,
    img: "https://via.placeholder.com/300x300?text=Canon+EOS+90D", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Canon+EOS+90D", "https://via.placeholder.com/300x300?text=Canon+Image+2", "https://via.placeholder.com/300x300?text=Canon+Image+3"],
  },
  {
    id: 2,
    title: "Nikon D850",
    color: "Black",
    price: 169999,
    description: "Nikon D850 DSLR Camera with 45.7 MP full-frame sensor.",
    rating: 4.9,
    img: "https://via.placeholder.com/300x300?text=Nikon+D850", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Nikon+D850", "https://via.placeholder.com/300x300?text=Nikon+Image+2", "https://via.placeholder.com/300x300?text=Nikon+Image+3"],
  },
  {
    id: 3,
    title: "Sony Alpha 7 III",
    color: "Black",
    price: 149999,
    description: "Sony Alpha 7 III Mirrorless Camera with 24.2 MP sensor.",
    rating: 4.7,
    img: "https://via.placeholder.com/300x300?text=Sony+Alpha+7+III", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Sony+Alpha+7+III", "https://via.placeholder.com/300x300?text=Sony+Image+2", "https://via.placeholder.com/300x300?text=Sony+Image+3"],
  },
  {
    id: 4,
    title: "Fujifilm X-T4",
    color: "Silver",
    price: 169999,
    description: "Fujifilm X-T4 Mirrorless Camera with 26.1 MP sensor.",
    rating: 4.6,
    img: "https://via.placeholder.com/300x300?text=Fujifilm+X-T4", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Fujifilm+X-T4", "https://via.placeholder.com/300x300?text=Fujifilm+Image+2", "https://via.placeholder.com/300x300?text=Fujifilm+Image+3"],
  },
  {
    id: 5,
    title: "Panasonic Lumix GH5",
    color: "Black",
    price: 84999,
    description: "Panasonic Lumix GH5 Mirrorless Camera with 4K video recording.",
    rating: 4.5,
    img: "https://via.placeholder.com/300x300?text=Panasonic+Lumix+GH5", // replace with actual image
    images: ["https://via.placeholder.com/300x300?text=Panasonic+Lumix+GH5", "https://via.placeholder.com/300x300?text=Panasonic+Image+2", "https://via.placeholder.com/300x300?text=Panasonic+Image+3"],
  },
];

const CameraPage = () => {
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
          <p className="text-sm text-primary">Top Selling Cameras for You</p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-4">
            Cameras
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-300 mt-2">
            Explore our latest collection of cameras for photography enthusiasts.
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
            View All Cameras
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
