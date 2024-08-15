import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useSearch } from '../context/SearchContext'; 
import ProductCard from '../components/ProductCard'; 
import '../styles/Products.css';

const Products = () => {
  const { addToCart } = useContext(AppContext);
  const { searchQuery } = useSearch();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products from API when component mounts
  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Set initially filtered products
      })
      .catch(error => {
        console.error('Failed to fetch products:', error);
      });
  }, []);

  // Filter products based on searchQuery
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, products]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductCard = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="products-container">
      <div className="products">
        <div className="product-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="product" onClick={() => handleProductClick(product)}>
                <img src={product.imgSrc} alt={product.name} />
                <h3>{product.name}</h3>
                <p>₹ {product.price}</p>
                <div className="product-actions">
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Add to Cart</button>
                </div>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
      {selectedProduct && (
        <ProductCard
          product={selectedProduct}
          onClose={handleCloseProductCard}
        />
      )}
    </div>
  );
};

export default Products;
