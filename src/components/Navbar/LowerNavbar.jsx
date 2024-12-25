import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Update with your firebase config path
import Navbar from './Navbar';
import Footer from '../Footer/Footer';
import { useNavigate } from "react-router-dom";
const LowerNavbar = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams(location.search);
      const category = params.get('category');

      if (category) {
        try {
          const q = query(collection(db, 'products'), where('category', '==', category));
          const querySnapshot = await getDocs(q);

          const fetchedProducts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setProducts(fetchedProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };

    fetchProducts();
  }, [location]);
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  return (
    <div>
        <Navbar/>
 
    <div className="px-6 py-8 bg-gray-100">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        {location.search?.split('=')[1]} Products
      </h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
                onClick={() => {
                    console.log("Product ID:", product.id);
                    handleProductClick(product.id);
                  }}
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">{product.name}</h2>
                <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
                <p className="text-lg font-medium text-gray-800 mb-2">₹{product.price}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Color:
                  <span
                    className="inline-block w-4 h-4 rounded-full ml-2"
                    style={{ backgroundColor: product.color }}
                  ></span>
                </p>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-sm text-red-600 font-bold">Discount: ₹{product.discount}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No products available in this category.
        </p>
      )}
    </div>
    <Footer/>
    </div>
  );
};

export default LowerNavbar;
