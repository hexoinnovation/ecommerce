import React, { useState } from "react";
import Img1 from "../../assets/women/women.png";
import Img2 from "../../assets/women/women2.jpg";
import Img3 from "../../assets/women/women3.jpg";
import Img4 from "../../assets/women/women4.jpg";
import { FaStar, FaEye, FaHeart, FaShoppingCart } from "react-icons/fa";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Women Ethnic",
    rating: 5.0,
    color: "white",
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    title: "Women Western",
    rating: 4.5,
    color: "Red",
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "Goggles",
    rating: 4.7,
    color: "brown",
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "Printed T-Shirt",
    rating: 4.4,
    color: "Yellow",
    aosDelay: "600",
  },
  {
    id: 5,
    img: Img2,
    title: "Fashion T-Shirt",
    rating: 4.5,
    color: "Pink",
    aosDelay: "800",
  },
];

const Products = () => {
  // State to track wishlist items
  const [wishlist, setWishlist] = useState([]);

  // Toggle wishlist state for a product
  const toggleWishlist = (id) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(id)
        ? prevWishlist.filter((item) => item !== id)
        : [...prevWishlist, id]
    );
  };

  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Top Selling Products for you
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Products
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit
            asperiores modi Sit asperiores modi
          </p>
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
            {/* card section */}
            {ProductsData.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                key={data.id}
                className="relative group space-y-3"
              >
                <div className="relative">
                  <img
                    src={data.img}
                    alt={data.title}
                    className="h-[220px] w-[150px] object-cover rounded-md"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md space-y-2">
                    <button
                      onClick={() => toggleWishlist(data.id)}
                      className="text-xl mx-2 p-2 rounded-full transition duration-300" style={{marginLeft:"90px",marginTop:"20px"}}
                    >
                      <FaHeart
                        className={`${
                          wishlist.includes(data.id) ? "text-red-500" : "text-white"
                        }`} 
                      />
                    </button>
                    <button className="text-xl text-white mx-2 p-2 rounded-full transition duration-300" style={{marginLeft:"90px"}}>
                      <FaEye />
                    </button>
                    {/* Add to Cart Button */}
                    <div className ="mt-20"style={{marginTop:"70px"}}> {/* Adjust margin to position the button lower */}
  <button className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md transition duration-300 hover:from-blue-600 hover:to-purple-700">
    <FaShoppingCart className="mr-2" />
    Add to Cart
  </button>
</div>

                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{data.title}</h3>
                  <p className="text-sm text-gray-600">{data.color}</p>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{data.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* view all button */}
          <div className="flex justify-center">
            <button className="text-center mt-10 cursor-pointer bg-primary text-white py-1 px-5 rounded-md">
              View All Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
