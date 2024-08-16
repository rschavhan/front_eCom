import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import _ from 'lodash'; // Import lodash for debounce
import '../styles/WishlistPage.css';

const WishlistPage = () => {
  const { userId, removeFromWishlist, addToCart } = useContext(AppContext);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, [userId]);

  // Fetch the list of products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch the user's wishlist
  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/wishlist/${userId}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/wishlist/${userId}/${productId}`);
      removeFromWishlist(productId); // Update context
      setWishlist(prevWishlist => prevWishlist.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    }
  };

  // Debounced function to add item to cart
  const debouncedAddToCart = _.debounce((productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product); // Use the same method from AppContext
    } else {
      console.error('Product not found');
    }
  }, 300); // Adjust debounce delay as needed

  // Method to add a wishlist product to the cart
  const addWishlistProductToCart = (productId) => {
    debouncedAddToCart(productId);
  };

  // Method to add a product to the cart
  const handleAddToCart = (productId) => {
    addWishlistProductToCart(productId); // Call the method to handle cart addition
  };

  if (loading) return <div>Loading...</div>;

  // Filter unique products for the wishlist
  const uniqueProductIds = new Set();
  const uniqueWishlist = wishlist.filter(item => {
    if (uniqueProductIds.has(item.productId)) {
      return false;
    } else {
      uniqueProductIds.add(item.productId);
      return true;
    }
  });

  return (
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>
      {uniqueWishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {uniqueWishlist.map(item => (
            <li key={item.productId}>
              {products.length > 0 && (
                <div>
                  {products.map(product =>
                    product.id === item.productId ? (
                      <div key={product.id}>
                        <img src={product.imgSrc} alt={product.name} />
                        <div>
                          <h2>{product.name}</h2>
                          <p>Price: ₹ {product.price ? product.price.toFixed(2) : 'N/A'}</p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling
                              handleAddToCart(product.id);
                            }}
                          >
                            Add to Cart
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling
                              handleRemoveFromWishlist(item.productId);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;
