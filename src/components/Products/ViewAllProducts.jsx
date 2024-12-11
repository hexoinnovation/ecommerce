import React, { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Sidebar } from "../Sidebar";

export const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setCurrentPage(1);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const filteredProducts = selectedSubcategory
    ? products.filter(
        (product) =>
          (product.subcategory || "").trim().toLowerCase() ===
          selectedSubcategory.trim().toLowerCase()
      )
    : products;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar onSubcategorySelect={handleSubcategorySelect} />

      <div className="flex-1 p-6 lg:p-8 bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">All Products</h2>
        {selectedSubcategory && (
          <h4 className="text-lg font-medium mb-6">
            Filtered by:{" "}
            <span className="text-primary">{selectedSubcategory}</span>
          </h4>
        )}

        {currentProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative mb-4 group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover rounded-md cursor-pointer group-hover:scale-105 transform transition-all duration-300"
                    onClick={() => handleProductClick(product.id)}
                  />
                  <FaHeart className="absolute top-4 right-4 text-gray-400 group-hover:text-red-500 cursor-pointer transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {product.description}
                </p>

                <div className="flex items-center space-x-2">
  <span className="font-medium text-gray-700 dark:text-gray-400">Color:</span>
  {/* <span className="text-sm text-gray-600 dark:text-gray-300">{product.color}</span> */}
  <div
    className="w-6 h-6 rounded-full"
    style={{ backgroundColor: product.color.toLowerCase() }}
  ></div>
</div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={
                          index < product.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ₹{product.price}
                  </p>
                </div>

                <div className="mt-4 flex space-x-4">
                  <button className="flex-1 bg-primary text-white py-2 rounded-lg shadow-md hover:bg-primary-dark transition">
                    <FaShoppingCart className="inline-block mr-2" />
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 text-center mt-12">
            No products available for the selected category.
            

          </p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  currentPage === index + 1
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
