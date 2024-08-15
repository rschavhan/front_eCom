import React from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="product-card-overlay">
      <div className="product-card">
        <button className="close-button" onClick={onClose}>✖</button>
        <img src={product.imgSrc} alt={product.name} className="product-card-image" />
        <div className="product-card-details">
          <h2>{product.name}</h2>
          <p>Price: ₹ {product.price}</p>
          <p>Storage: {product.storage}</p>
          <p>Color: {product.color}</p>
          {/* Add more product details here */}
        </div>
        <div className="product-card-actions">
          <button onClick={() => onClose(product)}>Buy Now</button>
          <button onClick={() => onClose(product)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
