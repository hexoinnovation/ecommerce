import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Img1 from "../../assets/common/dress1.jpg";
import Img2 from "../../assets/common/e7.webp";
import Img3 from "../../assets/common/e3.jpg";
import Img4 from "../../assets/shirt/shirt.png";
import Img5 from "../../assets/common/e6.jpg";
import { FaStar } from "react-icons/fa";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Women Ethnic",
    rating: 5.0,
    color: "white",
    
  },
  {
    id: 2,
    img: Img2,
    title: "Women Hair Accessories",
    rating: 4.5,
    color: "Red",
  },
  {
    id: 3,
    img: Img3,
    title: "Shoes",
    rating: 4.7,
    color: "brown",
  },
  {
    id: 4,
    img: Img4,
    title: "Printed T-Shirt",
    rating: 4.4,
    color: "Yellow",
  },
  {
    id: 5,
    img: Img5,
    title: "Hair Accessories",
    rating: 4.5,
    color: "Pink",
  },
];

const Products = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // Toggle wishlist state for a product
  const toggleWishlist = (id) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(id)
        ? prevWishlist.filter((item) => item !== id)
        : [...prevWishlist, id]
    );
  };

  // Handle navigation on image click
  const handleImageClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="mt-14 mb-12">
      <div className="container">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p className="text-sm text-primary">Top Selling Products for you</p>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-xs text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
          {ProductsData.map((data) => (
            <div key={data.id} className="relative group space-y-3">
              <div className="relative">
                <img
                  src={data.img}
                  alt={data.title}
                  className="h-[220px] w-[150px] object-cover rounded-md cursor-pointer"
                  onClick={() => handleImageClick(data.id)}
                />
              </div>
              <div>
                <h3 className="font-semibold">{data.title}</h3>
                <p className="text-sm text-gray-600">{data.color}</p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span>{data.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button className="text-center mt-10 cursor-pointer bg-primary text-white py-1 px-5 rounded-md">
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
