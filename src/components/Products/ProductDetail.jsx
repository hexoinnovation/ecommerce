import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaShoppingCart, FaHeart, FaMoneyBillAlt } from 'react-icons/fa';
import { useProducts } from '../../context/ProductsContext';
import { useCart } from '../../context/CartContext'; // Import the useCart hook

const ProductDetail = () => {
  const products = useProducts(); // Get products from context
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  
  const { addToCart } = useCart(); // Get addToCart function from CartContext

  // Check if products are loaded
  if (!products) {
    return <div>Loading...</div>; // Or some loading spinner
  }

  const product = products.find((item) => item.id === parseInt(id, 10));

  if (!product) {
    return <div>Product not found.</div>;
  }

  const [mainImage, setMainImage] = useState(product?.img || '');
  const [isWishlist, setIsWishlist] = useState(false); // Wishlist state
  const [quantity, setQuantity] = useState(1); // Quantity state

  const handleGoBack = () => {
    navigate('/view-all'); // Go back to the products list
  };

  const handleWishlistToggle = () => {
    setIsWishlist((prev) => !prev); // Toggle wishlist state
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1); // Increment quantity
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1); // Decrement quantity (prevent going below 1)
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity }); // Add the product with the current quantity to the cart
    navigate('/cart')
  };

  return (
    <div className="min-h-screen flex items-center justify-center sm:mt-0 mt-10 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto  p-4 max-w-4xl">
        <button
          onClick={handleGoBack}
          className="text-xl text-primary dark:text-white flex items-center gap-2 mb-4"
        >
          <FaArrowLeft className="text-lg" />
          Back to Products
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="flex flex-col items-center lg:items-start mb-8 lg:mb-0">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full max-w-sm lg:max-w-md h-96 object-cover rounded-xl shadow-lg"
            />
            <div className="flex gap-4 mt-4">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-md cursor-pointer"
                  onClick={() => setMainImage(image)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{product.name}</h2>
              <button
                onClick={handleWishlistToggle}
                className={`text-2xl ${isWishlist ? 'text-red-500' : 'text-gray-500'}`}
              >
                <FaHeart />
              </button>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300">{product.description}</p>

            <div className="flex items-center space-x-2 text-yellow-500">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < product.rating ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
              <span className="text-gray-600 dark:text-gray-300">({product.rating})</span>
            </div>

            <div className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">
              ₹{product.price}
            </div>

            {/* Quantity Section */}
            <div className="flex items-center space-x-2 mt-4">
              <button
                onClick={handleDecrement}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                className="w-16 text-center border border-gray-300 rounded-md"
              />
              <button
                onClick={handleIncrement}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                +
              </button>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleAddToCart} // Call addToCart when the button is clicked
                className="w-full sm:w-36 py-3 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                <FaShoppingCart /> Add to Cart
              </button>

              {/* Buy Now Button */}
              <button className="w-full sm:w-36 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                <FaMoneyBillAlt /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
