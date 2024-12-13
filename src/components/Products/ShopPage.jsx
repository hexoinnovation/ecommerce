import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { db } from '../firebase'; // Firestore configuration
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions for getting data
import {
  ShoppingCartIcon,
} from "@heroicons/react/solid";
import { Link } from "react-router-dom";
export const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleImageClick = (id) => {
    navigate(`/product/${id}`);
  };

  const settings = {
    dots: false, // Enable dots for navigation
    infinite: true, // Loop the carousel
    speed: 500, // Transition speed
    slidesToShow: 5, // Number of slides visible
    slidesToScroll: 1, // Number of slides to scroll
    focusOnSelect: true, // Allow dot click to navigate
  
    responsive: [
      {
        breakpoint: 1024, // Tablet view
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // Mobile view
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  

  return (
    <div className="mt-14 mb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p className="text-sm text-primary">Top Selling Products for You</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-xs text-gray-400 dark:text-gray-300">
            Explore our latest collection of stylish products for every occasion.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-300">
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-300">
            <p>No products available at the moment.</p>
          </div>
        ) : (
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.id} className="p-4">
                <div
                  className="relative  group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                  onClick={() => handleImageClick(product.id)}
                >
                  <img
                    src={product.image || '/fallback-image.jpg'}
                    alt={product.name}
                    className="h-[260px] w-full object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <h2 className="font-semibold text-s text-gray-900 dark:text-white">
                      {product.description}
                    </h2>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`${
                            index < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-gray-600 dark:text-gray-400">
                        ({product.rating.toFixed(1)})
                      </span>
                    </div>
                    <div className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
                      ₹{product.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      
      </div>
      
      <div className="flex justify-center items-center h-full">
  <Link to={"/view-all"}>
    <button className="w-full bg-primary sm:w-auto hover:bg-primary/40 px-4 py-2 rounded-md font-bold text-lg flex items-center space-x-2">
      <ShoppingCartIcon className="h-5 w-5 text-black dark:text-white" />
      <span>View All Products</span>
    </button>
  </Link>
</div>

    </div>
  );
};
