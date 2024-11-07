import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar"; // Adjusted path
import Footer from "../Footer/Footer"; // Adjusted path
import { ProductsData } from "../../data"; // Adjusted path

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const product = ProductsData.find((item) => item.id === parseInt(id)); // Find the product by ID

  if (!product) {
    return <div>Product not found</div>; // If no product is found, show an error message
  }

  return (
    <div>
      <Navbar /> {/* Render Navbar */}
      <div className="container mt-14">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-xs text-gray-400">{product.color}</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-yellow-400">★</span>
            <span>{product.rating}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={product.img}
            alt={product.title}
            className="h-[300px] w-[250px] object-cover rounded-md"
          />
        </div>
      </div>

      <Footer /> {/* Render Footer */}
    </div>
  );
};

export default ProductDetails;
