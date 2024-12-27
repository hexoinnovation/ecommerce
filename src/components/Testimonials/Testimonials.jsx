import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Update with your Firebase config path

const Testimonials = () => {
  const [bestProducts, setBestProducts] = useState([]);

  // Function to fetch products from Firestore
  const fetchBestProducts = async () => {
    try {
      const productsCollection = collection(db, "products"); // Replace with your Firestore collection name
      const q = query(productsCollection, where("offers", "==", "offer_product"));
      const querySnapshot = await getDocs(q);

      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  // Randomize the products and pick the first 4
  const randomProducts = products
  .sort(() => Math.random() - 0.5) // Randomize order
  .slice(0, 4); // Pick the first 4 products
      setBestProducts(randomProducts);
    } catch (error) {
      console.error("Error fetching best products: ", error);
    }
  };

  useEffect(() => {
    fetchBestProducts();
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-white via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Exclusive Discounts Just for You!
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-4 max-w-3xl mx-auto">
            Shop our best-selling products with amazing discounts. Hurry,
            limited-time offers!
          </p>
        </div>

        {/* Testimonial Content */}
        {bestProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group"
              >
                {/* Image Section */}
                <div className="relative h-56 sm:h-64">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg group-hover:opacity-90 transition-opacity duration-300"
                  />
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm sm:text-lg font-semibold px-4 py-2 rounded-full shadow-md z-10">
                    {product.discount}% Off
                  </div>
                </div>

                {/* Description Section */}
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                    {product.description}
                  </p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-4">
                    ₹{product.price}
                  </p>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700 dark:text-gray-300">
            No discounted products available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
