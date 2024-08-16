// src/components/Modal.js
import React from 'react';
import '../styles/Modal.css';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, product, addToCart }) => {
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  // Calculate average rating
  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  const handleBuyNow = () => {
    // Navigate to Billing page with price and other required data
    navigate('/checkout', { state: { totalAmount: product.price, cart: [product] } });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>✖</button>
        <div className="modal-body">
          <img src={product.imgSrc} alt={product.name} className="modal-image" />
          <div className="modal-details">
            <h2>{product.name}</h2>
            <p>Price: ₹ {product.price}</p>
            <p>Storage: {product.storage}</p>
            <p>Color: {product.color}</p>
            <h3>Reviews</h3>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="reviews-list">
                {product.reviews.map((review, index) => (
                  <div key={index} className="review">
                    <p><strong>{review.reviewerName}</strong> ({review.rating} stars)</p>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}
            <div className="average-rating">
              <h4>Average Rating: {averageRating.toFixed(1)} / 5</h4>
            </div>
            <div className="modal-buttons">
              <button onClick={() => { addToCart(product); onClose(); }}>Add to Cart</button>
              <button onClick={handleBuyNow}>Buy Now</button> {/* Add Buy Now button */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
