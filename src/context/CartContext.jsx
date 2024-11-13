// CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for cart data
const CartContext = createContext();

// CartProvider to wrap the app and provide cart state
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart items from localStorage if available
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(savedCartItems);
  }, []);

  // Update cart items in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  //Add Product to Cart
  const addToCart = (product) => {
    setCartItems((prevCartItems) => {
      // Check if the product already exists in the cart
      const existingItem = prevCartItems.find((item) => item.id === product.id);
      if (existingItem) {
        // If product already exists, return the updated cart with the updated product
        return prevCartItems.map((item) =>
          item.id === product.id ? { ...item, ...product } : item
        );
      } else {
        // If product does not exist, add it to the cart
        return [...prevCartItems, { ...product }];
      }
    });
  };
  
  // Remove product from the cart
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
