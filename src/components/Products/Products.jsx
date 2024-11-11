import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Img1 from "../../assets/common/dress1.jpg";
import Img2 from "../../assets/common/e7.webp";
import Img3 from "../../assets/common/e3.jpg";
import Img4 from "../../assets/shirt/shirt.png";
import Img5 from "../../assets/common/e6.jpg";
import { FaStar } from "react-icons/fa";

// Export ProductsData so it can be used in other files
export const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Women Ethnic",
    rating: 5.0,
    color: "white",
    category: "Clothing",
    price: 4999,  // Price in Rupees
    description: "A beautiful ethnic dress perfect for all occasions.",
    sizes: ["S", "M", "L", "XL"], // Sizes added here
  },
  {
    id: 2,
    img: Img2,
    title: "Women Hair Accessories",
    rating: 4.5,
    color: "Red",
    category: "Accessories",
    price: 1599,  // Price in Rupees
    description: "Trendy and fashionable hair accessories for every style.",
    sizes: ["One Size"], // One size for accessories
  },
  {
    id: 3,
    img: Img3,
    title: "Shoes",
    rating: 4.7,
    color: "Brown",
    category: "Footwear",
    price: 7999,  // Price in Rupees
    description: "Comfortable shoes for daily use, made of high-quality leather.",
    sizes: ["6", "7", "8", "9", "10"], // Shoe sizes
  },
  {
    id: 4,
    img: Img4,
    title: "Printed T-Shirt",
    rating: 4.4,
    color: "Yellow",
    category: "Clothing",
    price: 1999,  // Price in Rupees
    description: "A stylish printed t-shirt for casual wear.",
    sizes: ["S", "M", "L", "XL"], // Sizes added here
  },
  {
    id: 5,
    img: Img5,
    title: "Hair Accessories",
    rating: 4.5,
    color: "Pink",
    category: "Accessories",
    price: 1099,  // Price in Rupees
    description: "Colorful hair accessories to add style to your look.",
    sizes: ["One Size"], // One size for accessories
  },
];

const Products = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle image click to navigate to product detail page
  const handleImageClick = (id) => {
    navigate(`/product/${id}`);
  };

  // Handle View All Products button click
  const handleViewAllClick = () => {
    navigate("/view-all");
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
          {ProductsData.map((data) => (
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

                {/* Available Sizes */}
                <div className="mt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Sizes: </p>
                  <div className="flex gap-2 mt-2">
                    {data.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-700 py-1 px-2 rounded-full text-sm"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
                  ₹{data.price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleViewAllClick}  // Add onClick handler here
            className="bg-primary text-white py-2 px-6 rounded-md shadow-md hover:bg-primary-dark transition-colors duration-300"
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
