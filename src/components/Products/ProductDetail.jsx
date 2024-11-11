import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // useNavigate for redirection
import { FaStar, FaShoppingCart, FaHeart, FaShoppingBag, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { ProductsData } from '../Products/Products';
import { useCart } from '../../context/CartContext'; // Assuming you're using a CartContext for global state

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const product = ProductsData.find((item) => item.id === parseInt(id)); // Find the product by ID
  const { addToCart } = useCart(); // Access addToCart from the cart context
  const navigate = useNavigate(); // For programmatically navigating to the Cart page

  // If product is not found
  if (!product) {
    return <div>Product not found</div>;
  }

  // Manage selected size and quantity state
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1); // State to track quantity
  const [mainImage, setMainImage] = useState(product.img); // Set the main image for product view

  // Handle size selection
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  // Handle increase and decrease in quantity
  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // Add product to cart and redirect to CartPage
  const handleAddToCart = () => {
    const productToAdd = { ...product, quantity };
    addToCart(productToAdd); // Add the product to the cart context
    navigate('/cart'); // Redirect to the CartPage
  };

  // Add to cart and stay on the page (no redirect)
  const handleBuyNow = () => {
    const productToAdd = { ...product, quantity };
    addToCart(productToAdd); // Add the product to the cart context
    navigate('/checkout'); // Redirect to Checkout page directly
  };

  return (
    <div className="mt-14 sm:mt-5 mb-12 container px-4 lg:px-16 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Image Section */}
        <div className="flex flex-col items-center lg:items-start">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full max-w-lg h-auto object-cover rounded-xl shadow-xl transition-transform transform hover:scale-105"
          />
          {/* Image Thumbnails */}
          {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
            <div className="flex gap-4 mt-4">
              {product.images.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => setMainImage(thumb)} // Set main image on click
                />
              ))}
            </div>
          ) : (
            <p>No images available</p> // Fallback message if no images exist
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-6 flex-1">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{product.title}</h2>
            <FaHeart className="text-2xl text-gray-600 dark:text-white cursor-pointer hover:text-red-500 transition-colors" />
          </div>

          <p className="text-lg text-gray-700 dark:text-gray-300">Color: <span className="font-semibold">{product.color}</span></p>

          <div className="flex items-center space-x-2 text-yellow-500">
            {[...Array(5)].map((_, index) => (
              <FaStar key={index} className={index < product.rating ? 'text-yellow-400' : 'text-gray-300'} />
            ))}
            <span className="text-gray-600 dark:text-gray-300">({product.rating})</span>
          </div>

          <div className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">
            <span className="text-primary">₹{product.price ? product.price : 'Price not available'}</span>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Select Size</h3>
            {product.sizes && product.sizes.length > 0 ? (
              <div className="flex gap-4 mt-2">
                {product.sizes.map((size, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={selectedSize === size}
                      onChange={() => handleSizeChange(size)}
                      className="form-radio text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{size}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">No sizes available</p>
            )}
          </div>

          <div className="mt-6 flex items-center gap-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleQuantityChange('decrease')}
                className="w-12 h-12 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-full flex items-center justify-center focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-600 transition-all transform active:scale-95"
              >
                <FaChevronDown className="text-lg" />
              </button>

              <div className="flex items-center justify-center w-16 h-12 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md border-2 border-gray-300 dark:border-gray-600 text-lg font-semibold">
                {quantity}
              </div>

              <button
                onClick={() => handleQuantityChange('increase')}
                className="w-12 h-12 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-full flex items-center justify-center focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-600 transition-all transform active:scale-95"
              >
                <FaChevronUp className="text-lg" />
              </button>
            </div>
          </div>

          {/* Add to Cart and Buy Now Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-36 py-3 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full sm:w-36 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <FaShoppingBag /> Buy Now
            </button>
          </div>

          {/* Product Description */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Product Description</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{product.description ? product.description : 'Description not available'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
