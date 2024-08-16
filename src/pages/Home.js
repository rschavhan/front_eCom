import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';
import Modal from '../components/Modal'; // Import Modal component
import '../styles/Home.css';

const Home = () => {
  const { addToCart } = useContext(AppContext);
  const { searchQuery, setSearchQuery } = useSearch();

  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const offers = [
    'offer1.png',
    'offer2.png',
    'offer3.png',
    'offer4.png',
  ];

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
    const query = searchQuery.toLowerCase();
    setDisplayedProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, products]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [offers.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true); // Open modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
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
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Buy Now</button>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Add to Cart</button>
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
        />
      )}
    </div>
  );
};

export default Home;
