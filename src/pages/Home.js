// src/pages/Home.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';
import Modal from '../components/Modal';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import _ from 'lodash';
import '../styles/Home.css';

const Home = () => {
  const { addToCart, wishlist, addToWishlist, removeFromWishlist, userId } = useContext(AppContext);
  const { searchQuery, setSearchQuery } = useSearch();
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Debounced search function
  const debouncedSearch = useCallback(
    _.debounce((query) => {
      setDisplayedProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }, 300),
    [products]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
        setDisplayedProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleWishlistToggle = async (product) => {
    if (!userId) {
      console.error('User not logged in.');
      return;
    }

    if (wishlist.some(item => item.id === product.id)) {
      removeFromWishlist(product.id);
      try {
        await axios.delete(`http://localhost:8080/api/wishlist/remove`, {
          params: { userId, productId: product.id }
        });
      } catch (error) {
        console.error('Error removing product from wishlist:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:8080/api/wishlist/add', {
          userId,
          productId: product.id
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        addToWishlist(product);
      } catch (error) {
        console.error('Error adding product to wishlist:', error);
      }
    }
  };

  const handleBuyNow = (product) => {
    // Navigate to Billing page with price and other required data
    navigate('/checkout', { state: { totalAmount: product.price, cart: [product] } });
  };

  return (
    <div className="home">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search for products..." 
          value={searchQuery} 
          onChange={handleSearchChange} 
        />
      </div>

      <div className="best-deals">
        <h2>Our Products</h2>
        {displayedProducts.length > 0 ? (
          <div className="product-list">
            {displayedProducts.map((product) => (
              <div key={product.id} className="product" onClick={() => handleProductClick(product)}>
                <img src={product.imgSrc} alt={product.name} />
                <h3>{product.name}</h3>
                <p>₹ {product.price}</p>
                <div className="product-actions">
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Add to Cart</button>
                  <button onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}>Buy Now</button> {/* Add Buy Now button */}
                  <div className="wishlist-icon" onClick={(e) => { e.stopPropagation(); handleWishlistToggle(product); }}>
                    {wishlist.some(item => item.id === product.id) ? <FaHeart color="red" /> : <FaRegHeart />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Please add some products from the admin panel.</p>
        )}
      </div>

      {selectedProduct && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          addToCart={addToCart} // Pass addToCart function here
        />
      )}
    </div>
  );
};

export default Home;
