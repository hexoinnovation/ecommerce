import React from 'react';
import { ViewAllProducts } from './ViewAllProducts';
import { Route, Routes, useNavigate } from "react-router-dom"; // Import useNavigate
import ProductDetail from './ProductDetail';
import { ProductsProvider } from '../../context/ProductsContext';

export const Products = () => {
    
            const navigate = useNavigate();

      const handleProductClick = (id) => {
        navigate(`/product/${id}`);
      };
    
      return (
        <ProductsProvider>
        <div className="sm:mt-20 mt-10">
          <Routes>
            <Route
              path="/"
              element={<ViewAllProducts />}
            />
            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />
          </Routes>
        </div>
        </ProductsProvider>
      );
    };
