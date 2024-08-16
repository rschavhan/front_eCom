import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api'; // Add this line
import { AppContext } from '../context/AppContext';
import '../styles/WishlistPage.css';

// ...rest of your component


const WishlistPage = () => {
  const { userId, removeFromWishlist } = useContext(AppContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      const response = await api.get(`/wishlist/${userId}`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${userId}/${productId}`);
      removeFromWishlist(productId); // Update the context state
      setWishlist(prevWishlist => prevWishlist.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {wishlist.map(item => (
            <li key={item.productId}>
              <img src={item.imgSrc} alt={item.name} />
              <div>
                <h2>{item.name}</h2>
                <p>Price: ₹ {item.price ? item.price.toFixed(2) : 'N/A'}</p>
                <button onClick={() => handleRemoveFromWishlist(item.productId)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;
