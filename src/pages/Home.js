import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useSearch } from '../context/SearchContext';
import '../styles/Home.css';

const Home = () => {
  const { addToCart } = useContext(AppContext);
  const { searchQuery, setSearchQuery } = useSearch(); // Get both searchQuery and setSearchQuery

  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const offers = [
    'offer1.png',
    'offer2.png',
    'offer3.png',
    'offer4.png',
    // Add more offer images as needed
  ];

  // Fetch products on initial load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
        setDisplayedProducts(response.data); // Initially display all products
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setDisplayedProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, products]);

  // Slideshow logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [offers.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update the search query in the context
  };

  return (
    <div className="home">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={handleSearchChange} // Handle input changes
        />
      </div>
      
      <div className="latest-offers">
        <button className="prev" onClick={prevSlide}>❮</button>
        <img src={offers[currentIndex]} alt={`Offer ${currentIndex + 1}`} />
        <button className="next" onClick={nextSlide}>❯</button>
      </div>
      
      <div className="best-deals">
        <h2>Best Deals</h2>
        <div className="product-list">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <div key={product.id} className="product">
                <img src={product.imgSrc} alt={product.name} />
                <h3>{product.name}</h3>
                <p>₹ {product.price}</p>
                <div className="product-actions">
                  <button onClick={() => addToCart(product)}>Buy Now</button>
                  <button onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
